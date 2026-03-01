const express = require('express');
const router = express.Router();
const Blog = require('../Models/Blog');
const { protect, adminOnly } = require('../Middleware/auth');

// ─────────────────────────────────────────────
// GET /api/blogs/category/:category  (before /:slug)
// ─────────────────────────────────────────────
router.get('/category/:category', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const data = await Blog.find({ category: req.params.category, published: true })
      .skip(skip).limit(Number(limit)).sort('-publishedAt').populate('author', 'name');
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────
// GET /api/blogs/admin/all
// Admin only — returns ALL blogs including drafts
// ─────────────────────────────────────────────
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 200 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const [data, total] = await Promise.all([
      Blog.find({})                          // ← no published filter
        .skip(skip)
        .limit(Number(limit))
        .sort('-createdAt')
        .populate('author', 'name email'),
      Blog.countDocuments({}),
    ]);
    res.json({ success: true, total, page: Number(page), data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────
// GET /api/blogs  — public (published only)
// ─────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;

    // If request comes with admin token show all, otherwise only published
    const filter = { published: true };
    if (category) filter.category = category;

    const skip = (Number(page) - 1) * Number(limit);
    const [data, total] = await Promise.all([
      Blog.find(filter)
        .skip(skip)
        .limit(Number(limit))
        .sort('-publishedAt')
        .populate('author', 'name'),
      Blog.countDocuments(filter),
    ]);
    res.json({ success: true, total, page: Number(page), data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────
// GET /api/blogs/:slug  — public
// ─────────────────────────────────────────────
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, published: true })
      .populate('author', 'name');
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────
// POST /api/blogs — Admin only
// ─────────────────────────────────────────────
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const blog = await Blog.create({ ...req.body, author: req.user._id });
    res.status(201).json({ success: true, message: 'Blog post created', data: blog });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────
// PUT /api/blogs/:id — Admin only
// ─────────────────────────────────────────────
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.json({ success: true, message: 'Blog updated', data: blog });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────
// PUT /api/blogs/:id/publish — Toggle publish
// ─────────────────────────────────────────────
router.put('/:id/publish', protect, adminOnly, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    blog.published = !blog.published;
    if (blog.published && !blog.publishedAt) blog.publishedAt = new Date();
    await blog.save();
    res.json({
      success: true,
      message: `Blog ${blog.published ? 'published' : 'moved to drafts'}`,
      data: blog,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────
// GET /api/blogs/:id/increment-view
// ─────────────────────────────────────────────
router.get('/:id/increment-view', async (req, res) => {
  try {
    await Blog.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    res.json({ success: true, message: 'View counted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────
// DELETE /api/blogs/:id — Admin only
// ─────────────────────────────────────────────
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.json({ success: true, message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;