import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import remark from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');

export function getSortedPostsData() {
    const fileNames = fs.readdirSync(postsDirectory);

    const allPostsData = fileNames.map((file) => {
        const id = file.replace(/.md$/, '');
        const filePath = path.join(postsDirectory, file)
        const data = fs.readFileSync(filePath, 'utf-8');
        const frontMatterData = matter(data);

        return { id, ...frontMatterData.data }
    });

    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1
        } else {
            return -1
        }
    })
}

export function getAllPostIds() {
    const files = fs.readdirSync(postsDirectory);

    const result = files.map((file) => ({
        params: {
            id: file.replace(/.md$/, '')
        }
    }));

    return result;
}

export async function getPostData(id) {
    const postPath = path.join(postsDirectory, `${id}.md`);
    const postData = fs.readFileSync(postPath, 'utf-8');

    const matterResults = matter(postData);
    const processedContent = await remark()
        .use(html)
        .process(matterResults.content);

    const contentHtml = processedContent.toString();

    return {
        id,
        contentHtml,
        ...matterResults.data
    }
}
