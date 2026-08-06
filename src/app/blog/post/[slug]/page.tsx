import { getPostBySlug } from '@/lib/db'
import Markdown from 'react-markdown'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostBySlug(slug)

    if (!post) {
        return {};
    }

    const title = post['title'] + ' | Andrew Melbourne\'s Development Blog';

    return {
        title: title,
        description: post['description'],
        openGraph: {
            images: post['og_image'] ? [post['og_image']] : [],
        },
    }
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
    const author = process.env.NEXT_PUBLIC_BLOG_AUTHOR || "Andrew Melbourne";
    const { slug } = await params;

    let post = getPostBySlug(slug);

    const dummyPost = {
        id: 'dummy',
        slug: 'dummy',
        title: "Example Blog Post",
        description: "This is a placeholder blog post.",
        content: "# Welcome!\n\nThis is an example blog post. The actual content could not be loaded.",
        og_image: null,
        created_at: new Date().toISOString(),
    };

    if (!post) {
        if (slug === 'dummy') {
            post = dummyPost;
        } else {
            notFound();
        }
    }

    return (
        <article className="max-w-3xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

                <div className="flex justify-between items-center">
                    <p className="text-gray-600">
                        by {author} • {new Date(post.created_at).toLocaleDateString()}
                    </p>
                    <Link href="/" className="inline-flex items-center align-center gap-2 hover:text-gray-900">
                        Blog Home
                    </Link>
                </div>

            </div>
            <div className="prose prose-lg prose-headings:mb-1 prose-headings:mt-0 prose-code:mt-0 prose-pre:mt-0 prose-img:m-0 max-w-none">
                <Markdown>{post.content}</Markdown>
            </div>
        </article>
    )
}
