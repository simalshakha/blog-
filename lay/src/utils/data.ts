import { formatDate } from "@/lib/utils";

export interface Post {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  slug: string;
  author: {
    name: string;
    avatar: string;
  };
  date: Date;
  tags: string[];
  likes: number;
  thumbnail: string;
}

export const mockPosts: Post[] = [
  {
    id: "1",
    title: "Getting Started with React 18",
    subtitle: "A comprehensive guide to the latest features",
    content: "<p>This is a sample blog post content...</p>",
    slug: "getting-started-with-react-18",
    author: {
      name: "John Doe",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
    },
    date: new Date("2024-02-20"),
    tags: ["React", "JavaScript"],
    likes: 42,
    thumbnail: "https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg",
  },
  {
    id: "2",
    title: "Building Modern UIs with Tailwind CSS",
    subtitle: "Learn how to create beautiful interfaces quickly",
    content: "<p>Another sample blog post content...</p>",
    slug: "building-modern-uis-with-tailwind",
    author: {
      name: "Jane Smith",
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    },
    date: new Date("2024-02-19"),
    tags: ["CSS", "Design"],
    likes: 35,
    thumbnail: "https://images.pexels.com/photos/12883026/pexels-photo-12883026.jpeg",
  },
];

export const popularTags = [
  "React",
  "JavaScript",
  "TypeScript",
  "CSS",
  "Design",
  "Web Development",
  "Programming",
  "Technology",
];

export const trendingPosts = mockPosts.slice(0, 5);