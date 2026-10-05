import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  excerpt: { type: String, default: '', trim: true },
  content: { type: String, required: true },
  coverImageUrl: { type: String, default: '' },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  tags: [{ type: String, trim: true }],
  seoTitle: { type: String, default: '', trim: true },
  seoDescription: { type: String, default: '', trim: true },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
    index: true
  },
  publishedAt: { type: Date, default: null, index: true }
}, {
  timestamps: true,
  collection: 'blogPosts'
});

blogPostSchema.index({ title: 'text', content: 'text', excerpt: 'text', tags: 'text' });

const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', blogPostSchema);
export default BlogPost;
