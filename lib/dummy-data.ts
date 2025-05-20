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

export const candidates: Candidate[] = [
  {
    id: "1",
    name: "Alex Johnson",
    party: "Progressive Party",
    position: "Senate Candidate",
    bio: "Alex Johnson is a former educator and community organizer focused on economic equality and healthcare reform.",
    image: "/candidates/candidate1.jpg",
    issues: {
      economy: {
        stance: "Supports increased minimum wage and progressive taxation",
        explanation: "Believes in reducing income inequality through higher taxes on the wealthy and corporations to fund social programs."
      },
      healthcare: {
        stance: "Advocates for universal healthcare",
        explanation: "Supports a single-payer healthcare system to ensure all citizens have access to quality healthcare regardless of income."
      },
      environment: {
        stance: "Strong climate action supporter",
        explanation: "Proposes green energy investments and stricter regulations on carbon emissions."
      },
      education: {
        stance: "Free public college tuition",
        explanation: "Wants to eliminate tuition at public colleges and universities and expand loan forgiveness programs."
      },
      immigration: {
        stance: "Supports path to citizenship",
        explanation: "Advocates for comprehensive immigration reform with a clear path to citizenship for undocumented immigrants."
      }
    },
    endorsements: ["Teachers Union", "Environmental Action Committee", "National Healthcare Workers"],
    education: ["B.A. Political Science, State University", "M.Ed. Education Policy, National University"],
    experience: ["City Council Member (2016-2020)", "School Board President (2012-2016)", "Community Organizer (2008-2012)"],
    website: "https://example.com/alexjohnson"
  },
  {
    id: "2",
    name: "Morgan Smith",
    party: "Conservative Alliance",
    position: "Senate Candidate",
    bio: "Morgan Smith is a business executive and former state treasurer with a focus on fiscal responsibility and economic growth.",
    image: "/candidates/candidate2.jpg",
    issues: {
      economy: {
        stance: "Advocates for tax cuts and deregulation",
        explanation: "Believes reducing taxes and regulations will stimulate economic growth and job creation."
      },
      healthcare: {
        stance: "Market-based healthcare solutions",
        explanation: "Supports private sector competition to lower costs while maintaining quality and innovation."
      },
      environment: {
        stance: "Balanced approach to environmental policy",
        explanation: "Favors incentives over regulations and supports an all-of-the-above energy strategy."
      },
      education: {
        stance: "School choice advocate",
        explanation: "Supports vouchers, charter schools, and other alternatives to traditional public education."
      },
      immigration: {
        stance: "Prioritizes border security",
        explanation: "Advocates for stronger border security measures before addressing other immigration reforms."
      }
    },
    endorsements: ["Chamber of Commerce", "Small Business Federation", "Law Enforcement Association"],
    education: ["B.S. Economics, National University", "MBA, Business School"],
    experience: ["State Treasurer (2016-2020)", "CEO, Regional Financial Group (2010-2016)", "State Representative (2006-2010)"],
    website: "https://example.com/morgansmith"
  },
  {
    id: "3",
    name: "Jordan Rivera",
    party: "Centrist Coalition",
    position: "Senate Candidate",
    bio: "Jordan Rivera is a former military officer and small business owner focused on practical solutions and bipartisan cooperation.",
    image: "/candidates/candidate3.jpg",
    issues: {
      economy: {
        stance: "Mixed approach to economic policy",
        explanation: "Supports targeted tax incentives for small businesses while maintaining a progressive tax structure."
      },
      healthcare: {
        stance: "Public option healthcare plan",
        explanation: "Advocates for expanding existing systems with a public option while preserving private insurance."
      },
      environment: {
        stance: "Market-driven climate solutions",
        explanation: "Supports carbon pricing mechanisms and renewable energy incentives without heavy regulation."
      },
      education: {
        stance: "Education reform and affordability",
        explanation: "Promotes community college expansion, technical training, and reasonable student loan reforms."
      },
      immigration: {
        stance: "Comprehensive immigration reform",
        explanation: "Supports strengthened borders alongside streamlined legal immigration processes and limited pathways to legal status."
      }
    },
    endorsements: ["Veterans Coalition", "Bipartisan Policy Center", "Technology Innovation Council"],
    education: ["B.A. International Relations, Coastal University", "Military Leadership Academy"],
    experience: ["Military Service (2006-2014)", "Small Business Owner (2014-Present)", "Community Foundation Director (2016-2020)"],
    website: "https://example.com/jordanrivera"
  },
  {
    id: "4",
    name: "Taylor Kim",
    party: "Freedom Party",
    position: "Senate Candidate",
    bio: "Taylor Kim is a civil liberties attorney and former tech entrepreneur focused on personal freedoms and limiting government intervention.",
    image: "/candidates/candidate4.jpg",
    issues: {
      economy: {
        stance: "Free market advocate",
        explanation: "Believes in minimal government intervention in markets and substantial reduction in regulations."
      },
      healthcare: {
        stance: "Free-market healthcare reform",
        explanation: "Supports health savings accounts, interstate insurance competition, and price transparency reforms."
      },
      environment: {
        stance: "Innovation over regulation",
        explanation: "Favors private sector and technological solutions to environmental challenges over government mandates."
      },
      education: {
        stance: "Education decentralization",
        explanation: "Advocates for local control of education, school choice, and reduced federal involvement."
      },
      immigration: {
        stance: "Merit-based immigration system",
        explanation: "Supports a streamlined, skills-based immigration system with simplified processes for legal entry."
      }
    },
    endorsements: ["Digital Rights Association", "Small Government Coalition", "Entrepreneurs League"],
    education: ["J.D., Capital Law School", "B.S. Computer Science, Tech Institute"],
    experience: ["Civil Liberties Attorney (2012-Present)", "Technology Startup Founder (2008-2014)", "Policy Analyst (2006-2008)"],
    website: "https://example.com/taylorkim"
  },
  {
    id: "5",
    name: "Casey Wilson",
    party: "Green Future Party",
    position: "Senate Candidate",
    bio: "Casey Wilson is an environmental scientist and community activist focused on climate action and sustainable development.",
    image: "/candidates/candidate5.jpg",
    issues: {
      economy: {
        stance: "Green economy transition",
        explanation: "Advocates for major investments in renewable energy and green infrastructure to create jobs and address climate change."
      },
      healthcare: {
        stance: "Universal healthcare advocate",
        explanation: "Supports single-payer healthcare that includes preventive care and focuses on environmental health factors."
      },
      environment: {
        stance: "Aggressive climate action",
        explanation: "Proposes rapid transition to 100% renewable energy, carbon neutrality by 2035, and substantial protections for natural resources."
      },
      education: {
        stance: "Free education and environmental literacy",
        explanation: "Supports free public college, student debt forgiveness, and enhanced environmental education in public schools."
      },
      immigration: {
        stance: "Human-centered immigration policy",
        explanation: "Advocates for welcoming policies that recognize climate refugees and create accessible pathways to citizenship."
      }
    },
    endorsements: ["Climate Action Network", "Progressive Scientists Alliance", "Sustainable Future Coalition"],
    education: ["Ph.D. Environmental Science, Research University", "M.S. Sustainability, Green College"],
    experience: ["Environmental Research Scientist (2010-2018)", "Climate Policy Advisor (2018-2020)", "Community Sustainability Organizer (2008-2010)"],
    website: "https://example.com/caseywilson"
  }
];

// Simulate async API calls
export async function getCandidates(): Promise<Candidate[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(candidates);
    }, 500);
  });
}

export async function getCandidate(id: string): Promise<Candidate | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(candidates.find(candidate => candidate.id === id));
    }, 500);
  });
}

export async function getIssues(): Promise<Issue[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(issues);
    }, 500);
  });
}

export async function getIssue(slug: string): Promise<Issue | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(issues.find(issue => issue.slug === slug));
    }, 500);
  });
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

export const quizQuestions: QuizQuestion[] = [
  {
    id: "1",
    question: "What should be the government's role in healthcare?",
    options: [
      {
        id: "1a",
        text: "The government should provide universal healthcare for all citizens",
        alignment: {
          "1": 95, // Alex Johnson (Progressive)
          "2": 20, // Morgan Smith (Conservative)
          "3": 60, // Jordan Rivera (Centrist)
          "4": 15, // Taylor Kim (Freedom)
          "5": 90, // Casey Wilson (Green)
        }
      },
      {
        id: "1b",
        text: "The government should offer a public option while preserving private insurance",
        alignment: {
          "1": 70,
          "2": 40,
          "3": 90,
          "4": 30,
          "5": 65,
        }
      },
      {
        id: "1c",
        text: "Healthcare should primarily rely on private markets with limited government intervention",
        alignment: {
          "1": 15,
          "2": 90,
          "3": 40,
          "4": 95,
          "5": 10,
        }
      }
    ]
  },
  {
    id: "2",
    question: "What approach should we take to address climate change?",
    options: [
      {
        id: "2a",
        text: "Implement aggressive regulations and invest heavily in renewable energy",
        alignment: {
          "1": 85,
          "2": 25,
          "3": 55,
          "4": 20,
          "5": 95,
        }
      },
      {
        id: "2b",
        text: "Use market incentives and carbon pricing to encourage clean energy adoption",
        alignment: {
          "1": 65,
          "2": 55,
          "3": 85,
          "4": 60,
          "5": 75,
        }
      },
      {
        id: "2c",
        text: "Focus on innovation and adaptation without imposing significant new regulations",
        alignment: {
          "1": 25,
          "2": 85,
          "3": 60,
          "4": 90,
          "5": 15,
        }
      }
    ]
  },
  {
    id: "3",
    question: "What is your position on tax policy?",
    options: [
      {
        id: "3a",
        text: "Increase taxes on corporations and high-income earners to fund social programs",
        alignment: {
          "1": 90,
          "2": 15,
          "3": 50,
          "4": 10,
          "5": 85,
        }
      },
      {
        id: "3b",
        text: "Maintain current tax rates with targeted adjustments to address specific issues",
        alignment: {
          "1": 50,
          "2": 60,
          "3": 85,
          "4": 45,
          "5": 40,
        }
      },
      {
        id: "3c",
        text: "Reduce tax rates across the board to stimulate economic growth",
        alignment: {
          "1": 15,
          "2": 90,
          "3": 45,
          "4": 95,
          "5": 10,
        }
      }
    ]
  },
  {
    id: "4",
    question: "What should our approach to immigration be?",
    options: [
      {
        id: "4a",
        text: "Create accessible pathways to citizenship and welcome more immigrants",
        alignment: {
          "1": 85,
          "2": 25,
          "3": 60,
          "4": 55,
          "5": 90,
        }
      },
      {
        id: "4b",
        text: "Reform the system to be more efficient while balancing security concerns",
        alignment: {
          "1": 65,
          "2": 55,
          "3": 90,
          "4": 75,
          "5": 60,
        }
      },
      {
        id: "4c",
        text: "Prioritize border security before addressing other immigration issues",
        alignment: {
          "1": 20,
          "2": 90,
          "3": 55,
          "4": 65,
          "5": 15,
        }
      }
    ]
  }
];

export async function getQuizQuestions(): Promise<QuizQuestion[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(quizQuestions);
    }, 500);
  });
} 