export interface Candidate {
  id: string;
  name: string;
  party: string;
  position: string;
  bio: string;
  image: string;
  issues: {
    [key: string]: {
      stance: string;
      explanation: string;
    };
  };
  endorsements: string[];
  education: string[];
  experience: string[];
  website: string;
}

export interface Issue {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
}

export const issues: Issue[] = [
  {
    id: "1",
    slug: "economy",
    title: "Economy",
    description: "Economic policies, jobs, taxation, and financial regulations",
    icon: "dollar-sign",
  },
  {
    id: "2",
    slug: "healthcare",
    title: "Healthcare",
    description: "Healthcare access, insurance, medical research and public health",
    icon: "heart-pulse",
  },
  {
    id: "3",
    slug: "environment",
    title: "Environment",
    description: "Climate change, conservation, energy policy and sustainability",
    icon: "leaf",
  },
  {
    id: "4",
    slug: "education",
    title: "Education",
    description: "Public schools, higher education, student loans and educational reform",
    icon: "graduation-cap",
  },
  {
    id: "5",
    slug: "immigration",
    title: "Immigration",
    description: "Border security, immigration reform, and citizenship pathways",
    icon: "globe",
  }
];

// API client functions for fetching data
export async function getCandidates(): Promise<Candidate[]> {
  try {
    // This will be replaced with actual API call
    return [];
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return [];
  }
}

export async function getCandidate(id: string): Promise<Candidate | undefined> {
  try {
    // This will be replaced with actual API call
    return undefined;
  } catch (error) {
    console.error(`Error fetching candidate with ID ${id}:`, error);
    return undefined;
  }
}

export async function getIssues(): Promise<Issue[]> {
  try {
    // This will be replaced with actual API call
    return issues;
  } catch (error) {
    console.error("Error fetching issues:", error);
    return issues; // Fallback to hardcoded issues
  }
}

export async function getIssue(slug: string): Promise<Issue | undefined> {
  try {
    // This will be replaced with actual API call
    return issues.find(issue => issue.slug === slug);
  } catch (error) {
    console.error(`Error fetching issue with slug ${slug}:`, error);
    return issues.find(issue => issue.slug === slug);
  }
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    alignment: {
      // Map candidate IDs to alignment scores (0-100)
      [candidateId: string]: number;
    };
  }[];
}

// Empty quiz questions array to be filled by API
export const quizQuestions: QuizQuestion[] = [];

export async function getQuizQuestions(): Promise<QuizQuestion[]> {
  try {
    // This will be replaced with actual API call
    return [];
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    return [];
  }
} 