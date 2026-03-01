const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    slug: { type: String, unique: true },
    content: { type: String, required: [true, 'Content is required'] },
    excerpt: { type: String },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    featuredImage: { type: String },
    category: {
      type: String,
      enum: ['travel-tips', 'news', 'nairobi-guides', 'hospitality', 'lifestyle'],
    },
    tags: [String],
    published: { type: Boolean, default: false },
    publishedAt: { type: Date },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-generate slug from title
blogSchema.pre('save', async function () {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  if (this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  };
});


blogSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Blog', blogSchema);
