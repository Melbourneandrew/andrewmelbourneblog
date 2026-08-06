'use server';

import { createPost as insertPost, deletePost as removePost } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPost(prevState: { loading: boolean, error: string }, formData: FormData) {
    const title = formData.get('title');
    const content = formData.get('content') as File;
    const description = formData.get('description');
    const slug = formData.get('slug');
    const ogImageUrl = formData.get('og-image-url') ?? '';

    if (!title || !content || !description || !slug) {
        return { error: 'Missing required fields', loading: false };
    }

    // Validate slug format
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(slug.toString())) {
        return {
            error: 'Invalid slug format. Use only lowercase letters, numbers, and hyphens.',
            loading: false
        };
    }

    const markdownContent = await content.text();

    try {
        insertPost({ title: title.toString(), slug: slug.toString(), content: markdownContent,
            description: description.toString(), og_image: ogImageUrl.toString() || null });

    } catch (error) {
        console.error('Error saving post:', error);
        return { error: 'Failed to create post', loading: false };
    }

    revalidatePath('/admin');
    revalidatePath('/');
    redirect('/admin');
}

export async function revalidateBlogHome() {
    revalidatePath('/blog/post/[slug]', 'layout');
    revalidatePath('/');
}

export async function deletePost(postId: string) {
    try {
        removePost(postId);

        revalidatePath('/');
        revalidatePath('/blog/post/[slug]', 'layout');

        return { success: true };
    } catch (error) {
        console.error('Error deleting post:', error);
        return { success: false, error: 'Failed to delete post' };
    }
}
