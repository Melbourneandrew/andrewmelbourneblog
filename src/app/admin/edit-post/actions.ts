'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function editPost(formData: FormData) {
    const supabase = await createClient();
    const postId = formData.get('postId');
    const title = formData.get('title');
    const content = formData.get('content') as File | null;
    const description = formData.get('description');
    const slug = formData.get('slug');
    const ogImageUrl = formData.get('og-image-url') ?? '';
    const createdAt = formData.get('created-at');

    if (!postId || !title || !description || !slug || !createdAt) {
        throw new Error('Missing required fields');
    }

    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(slug.toString())) {
        throw new Error('Invalid slug format. Use only lowercase letters, numbers, and hyphens.');
    }

    try {
        const updateData: any = {
            title,
            slug,
            description,
            og_image: ogImageUrl,
            created_at: createdAt
        };

        if (content instanceof File && content.size > 0) {
            console.log('Content is a file');
            const markdownContent = await content.text();
            updateData.content = markdownContent;
        }

        console.log(updateData);

        const { error, data } = await supabase
            .from('blog_posts')
            .update(updateData)
            .eq('id', postId);

        console.log('Supabase response:', { error, data });

        if (error?.code === '23505') throw new Error('A post with this slug already exists.');
        if (error) throw new Error(`Failed to update post: ${error.message}`);
    } catch (error) {
        console.error('Error updating post:', error);
        throw error;
    }

    revalidatePath('/blog/[slug]', 'layout');
    revalidatePath('/admin');
    revalidatePath('/');
    redirect('/admin');
}
