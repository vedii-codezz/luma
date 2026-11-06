import { SubjectData, WeakConcept, QuizQuestion, DocumentItem, TutorArticle, Flashcard } from './types';

export const SUBJECTS: SubjectData[] = [
  {
    id: 'data-structures',
    name: 'Data Structures',
    mastery: 76,
    conceptsCount: 18,
    lastStudied: '24 min ago',
    description: 'Tree balancing, amortized runtime analysis, graphs, and memory layout optimization.',
    treeRoot: {
      id: 'trees-root',
      name: 'Trees',
      mastery: 72,
      status: 'strong',
      children: [
        {
          id: 'binary-trees',
          name: 'Binary Trees',
          mastery: 91,
          status: 'mastered',
          notesRef: 'Lecture 03, p. 4'
        },
        {
          id: 'bst',
          name: 'Binary Search Trees',
          mastery: 83,
          status: 'strong',
          notesRef: 'Lecture 04, p. 12'
        },
        {
          id: 'avl-trees',
          name: 'AVL Trees',
          mastery: 68,
          status: 'learning',
          notesRef: 'AVL Trees.pdf, p. 16',
          children: [
            {
              id: 'balance-factor',
              name: 'Balance Factor',
              mastery: 76,
              status: 'strong',
              notesRef: 'AVL Trees.pdf, p. 14'
            },
            {
              id: 'll-rotation',
              name: 'LL Rotation',
              mastery: 90,
              status: 'mastered',
              notesRef: 'AVL Trees.pdf, p. 15'
            },
            {
              id: 'rr-rotation',
              name: 'RR Rotation',
              mastery: 88,
              status: 'mastered',
              notesRef: 'AVL Trees.pdf, p. 15'
            },
            {
              id: 'lr-rotation',
              name: 'LR Rotation',
              mastery: 42,
              status: 'weak',
              notesRef: 'AVL Trees.pdf, p. 16'
            },
            {
              id: 'rl-rotation',
              name: 'RL Rotation',
              mastery: 63,
              status: 'learning',
              notesRef: 'AVL Trees.pdf, p. 17'
            }
          ]
        },
        {
          id: 'red-black-trees',
          name: 'Red Black Trees',
          mastery: 55,
          status: 'learning',
          notesRef: 'Advanced Structures, p. 28'
        },
        {
          id: 'b-plus-trees',
          name: 'B+ Trees',
          mastery: 48,
          status: 'weak',
          notesRef: 'Database Indexing, p. 8'
        }
      ]
    }
  },
  {
    id: 'discrete-math',
    name: 'Discrete Mathematics',
    mastery: 82,
    conceptsCount: 24,
    lastStudied: '3 hours ago',
    description: 'Propositional logic, combinatorics, graph theory, and recurrence relations.',
    treeRoot: {
      id: 'discrete-root',
      name: 'Foundations',
      mastery: 82,
      status: 'strong',
      children: [
        {
          id: 'prop-logic',
          name: 'Propositional Logic',
          mastery: 88,
          status: 'mastered',
          notesRef: 'Discrete_Math_Ch1.pdf'
        },
        {
          id: 'combinatorics',
          name: 'Combinatorics',
          mastery: 79,
          status: 'strong',
          notesRef: 'Discrete_Math_Ch4.pdf'
        },
        {
          id: 'graph-theory',
          name: 'Graph Theory',
          mastery: 84,
          status: 'strong',
          notesRef: 'Discrete_Math_Ch7.pdf'
        },
        {
          id: 'recurrences',
          name: 'Recurrence Relations',
          mastery: 64,
          status: 'learning',
          notesRef: 'Discrete_Math_Ch9.pdf'
        }
      ]
    }
  },
  {
    id: 'applied-gen-ai',
    name: 'Applied Gen AI',
    mastery: 91,
    conceptsCount: 14,
    lastStudied: 'Yesterday',
    description: 'Multi-head attention, positional embeddings, inference quantization, and tokenization.',
    treeRoot: {
      id: 'gen-ai-root',
      name: 'Architectures',
      mastery: 91,
      status: 'mastered',
      children: [
        {
          id: 'transformers',
          name: 'Transformers',
          mastery: 94,
          status: 'mastered',
          notesRef: 'Attention_Is_All_You_Need.pdf'
        },
        {
          id: 'attention-mechanisms',
          name: 'FlashAttention',
          mastery: 89,
          status: 'strong',
          notesRef: 'Efficient_Inference.pdf'
        },
        {
          id: 'lora-fine-tuning',
          name: 'LoRA Adaptation',
          mastery: 90,
          status: 'mastered',
          notesRef: 'Parameter_Efficient_Tuning.pdf'
        }
      ]
    }
  }
];

export const WEAK_CONCEPTS: WeakConcept[] = [
  {
    id: 'lr-rotation',
    code: '01',
    name: 'LR Rotation',
    subjectId: 'data-structures',
    mastery: 42,
    reason: '2 of your last 4 practice answers were incorrect on double-rotation sequence.'
  },
  {
    id: 'avl-deletion',
    code: '02',
    name: 'AVL Deletion',
    subjectId: 'data-structures',
    mastery: 51,
    reason: 'O(log n) rebalancing propagation not fully consolidated.'
  },
  {
    id: 'balance-factor',
    code: '03',
    name: 'Balance Factor',
    subjectId: 'data-structures',
    mastery: 63,
    reason: 'Confusion between height(left) - height(right) convention in test suite.'
  }
];

export const RECENT_SUBJECTS = [
  'AVL Trees',
  'Combinatorics',
  'Transformers',
  'Propositional Logic'
];

export const RECENT_TUTOR_QUESTIONS = [
  'Explain LR rotation',
  'AVL deletion example',
  'B Tree vs B+ Tree',
  'What is a red-black tree?'
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'avl-q4',
    subject: 'Data Structures',
    topic: 'AVL TREES',
    questionNumber: '04',
    totalQuestions: '10',
    difficulty: 'MEDIUM',
    prompt: 'Which condition produces an LR imbalance?',
    options: [
      {
        id: 'A',
        label: 'Insertion in the left subtree of the left child'
      },
      {
        id: 'B',
        label: 'Insertion in the right subtree of the left child'
      },
      {
        id: 'C',
        label: 'Insertion in the left subtree of the right child'
      },
      {
        id: 'D',
        label: 'Insertion in the right subtree of the right child'
      }
    ],
    correctOption: 'B',
    explanation: 'LR imbalance occurs when the new node is inserted into the right subtree of the left child.',
    masteryTarget: {
      conceptName: 'LR Rotation',
      before: 42,
      after: 50
    }
  },
  {
    id: 'avl-q5',
    subject: 'Data Structures',
    topic: 'AVL TREES',
    questionNumber: '05',
    totalQuestions: '10',
    difficulty: 'MEDIUM',
    prompt: 'What is the maximum allowed balance factor difference in any node of a strictly valid AVL tree?',
    options: [
      { id: 'A', label: 'Balance factor must be exactly 0 at all internal nodes' },
      { id: 'B', label: 'Balance factor magnitude cannot exceed 1 (-1, 0, or +1)' },
      { id: 'C', label: 'Balance factor magnitude can reach 2 before immediate rotation' },
      { id: 'D', label: 'Depends on the log base 2 of the tree size' }
    ],
    correctOption: 'B',
    explanation: 'An AVL tree maintains the invariant that for every node, the height difference between left and right subtrees is at most 1.',
    masteryTarget: {
      conceptName: 'Balance Factor',
      before: 76,
      after: 82
    }
  }
];

export const DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-avl',
    title: 'AVL TREES',
    type: 'PDF',
    pageCount: 24,
    size: '1.4 MB',
    lastOpened: '24 min ago',
    subject: 'Data Structures',
    tags: ['Trees', 'Self-Balancing', 'Rotations'],
    excerpt: 'Self-balancing binary search trees where heights of two child subtrees of any node differ by at most one.'
  },
  {
    id: 'doc-discrete',
    title: 'DISCRETE MATHEMATICS - GRAPH THEORY',
    type: 'PDF',
    pageCount: 48,
    size: '3.2 MB',
    lastOpened: '3 hours ago',
    subject: 'Discrete Mathematics',
    tags: ['Graphs', 'Eulerian Paths', 'Isomorphism'],
    excerpt: 'Comprehensive notes covering Hamiltonian cycles, planarity testing, and chromatic polynomials.'
  },
  {
    id: 'doc-transformers',
    title: 'ATTENTION MECHANISMS AND TRANSFORMERS',
    type: 'Notes',
    pageCount: 16,
    size: '940 KB',
    lastOpened: 'Yesterday',
    subject: 'Applied Gen AI',
    tags: ['Deep Learning', 'Attention', 'Architecture'],
    excerpt: 'Detailed derivations of scaled dot-product attention, causal masking, and rotary embeddings.'
  },
  {
    id: 'doc-lecture05',
    title: 'LECTURE 05 - TREE BALANCING',
    type: 'PDF',
    pageCount: 12,
    size: '820 KB',
    lastOpened: '3 days ago',
    subject: 'Data Structures',
    tags: ['Course Notes', 'Lecture 5'],
    excerpt: 'Step-by-step trace of single and double rotations during node insertions and deletions.'
  }
];

export const TUTOR_ARTICLES: Record<string, TutorArticle> = {
  'explain lr rotation': {
    id: 'tutor-lr-rotation',
    query: 'Explain LR rotation using my notes',
    title: 'LR Rotation',
    summary: 'A double rotation used in AVL trees when a node is inserted into the right subtree of a left child.',
    explanation: 'An LR rotation (Left-Right rotation) resolves a zig-zag imbalance where the balance factor of the offending node is +2 and its left child has a balance factor of -1. Because a single rotation cannot re-center the median key, the operation requires two coordinated steps.',
    steps: [
      {
        number: '01',
        title: 'Perform a left rotation on the left child',
        description: 'First, perform a left rotation on the left child of the unbalanced node. This aligns the nodes into a straight line (left-left configuration).'
      },
      {
        number: '02',
        title: 'Perform a right rotation on the root',
        description: 'Then, perform a right rotation on the originally unbalanced ancestor node. The newly promoted median node becomes the new local subtree root.'
      }
    ],
    source: {
      document: 'AVL Trees.pdf',
      page: 16,
      quote: 'Section 4.3.2: When node k3 has left child k1, and insertion occurs in subtree Y of k1, an LR double rotation promotes node k2 to root.'
    },
    related: ['Balance Factor', 'LL Rotation', 'RL Rotation']
  },
  'avl deletion example': {
    id: 'tutor-avl-deletion',
    query: 'AVL deletion example',
    title: 'AVL Deletion',
    summary: 'Removing a node from an AVL tree and re-establishing balance factors up the search path.',
    explanation: 'Deletion follows standard BST removal: leaf nodes are removed directly, nodes with one child are bypassed, and nodes with two children are swapped with their in-order successor. After removal, balance factors must be re-evaluated upward towards the root, potentially requiring multiple rotations.',
    steps: [
      {
        number: '01',
        title: 'Standard BST deletion',
        description: 'Remove target key or replace with the minimum node in its right subtree.'
      },
      {
        number: '02',
        title: 'Bottom-up balance factor verification',
        description: 'Traverse up the recursion stack. Check if balance factor is outside [-1, 1].'
      },
      {
        number: '03',
        title: 'Execute localized rotations',
        description: 'Unlike insertion which requires at most two rotations, deletion may require up to O(log n) rotations along the ancestor chain.'
      }
    ],
    source: {
      document: 'AVL Trees.pdf',
      page: 19,
      quote: 'Deletion rebalancing does not terminate after one rotation; rebalance checks must propagate to the root.'
    },
    related: ['Balance Factor', 'LR Rotation', 'Binary Search Trees']
  },
  'b tree vs b+ tree': {
    id: 'tutor-btree',
    query: 'B Tree vs B+ Tree',
    title: 'B Tree vs B+ Tree Comparison',
    summary: 'Architectural and operational differences in self-balancing multiway search structures.',
    explanation: 'While both structures maintain balanced height for disk storage systems, B+ trees store all records strictly at the leaf level and link leaves sequentially, whereas B trees store key-record pairs in both internal and leaf nodes.',
    steps: [
      {
        number: '01',
        title: 'Key and data distribution',
        description: 'In a B tree, keys and values exist in all nodes. In a B+ tree, internal nodes only contain index keys; actual records reside in leaf nodes.'
      },
      {
        number: '02',
        title: 'Range queries and sequential access',
        description: 'B+ tree leaf nodes are linked via a doubly linked list, enabling O(log n + k) linear scans without tree re-traversals.'
      }
    ],
    source: {
      document: 'Lecture 05 - Tree Balancing.pdf',
      page: 7,
      quote: 'B+ Trees provide deterministic disk block utilization and superior sequential throughput.'
    },
    related: ['B+ Trees', 'Binary Search Trees', 'AVL Trees']
  },
  'what is a red-black tree?': {
    id: 'tutor-rbtree',
    query: 'What is a red-black tree?',
    title: 'Red-Black Tree',
    summary: 'A self-balancing binary search tree with relaxed height constraints and colored nodes.',
    explanation: 'Red-Black trees use a color bit (red or black) on each node to ensure no path from root to leaf is more than twice as long as any other path. This provides faster insertions and deletions at the cost of slightly slower lookups than AVL trees.',
    steps: [
      {
        number: '01',
        title: 'Root and leaf invariants',
        description: 'The root is always black. Every null leaf (NIL) is considered black.'
      },
      {
        number: '02',
        title: 'Red violation avoidance',
        description: 'If a node is red, both of its children must be black. No two red nodes may be adjacent.'
      },
      {
        number: '03',
        title: 'Black-height consistency',
        description: 'Every path from a node to any of its descendant NIL leaves contains the same count of black nodes.'
      }
    ],
    source: {
      document: 'AVL Trees.pdf',
      page: 22,
      quote: 'Red-Black trees trade lookup strictness for O(1) amortized structural updates.'
    },
    related: ['AVL Trees', 'Binary Search Trees', 'B+ Trees']
  }
};

export const FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-1',
    concept: 'LR Rotation',
    front: 'When is an LR double rotation required in an AVL tree?',
    back: 'When a node has a balance factor of +2 and its left child has a balance factor of -1 (insertion in right subtree of left child).',
    status: 'weak'
  },
  {
    id: 'fc-2',
    concept: 'Balance Factor',
    front: 'What is the balance factor formula?',
    back: 'Balance Factor = height(left subtree) - height(right subtree). Valid range is {-1, 0, +1}.',
    status: 'strong'
  },
  {
    id: 'fc-3',
    concept: 'AVL Height Bound',
    front: 'What is the upper bound on height for an AVL tree with n nodes?',
    back: 'Height h < 1.44 * log2(n + 2) - 0.328, strictly guaranteeing O(log n) operations.',
    status: 'learning'
  },
  {
    id: 'fc-4',
    concept: 'RR Rotation',
    front: 'What single rotation corrects an insertion in the right subtree of a right child?',
    back: 'A single Left Rotation (RR rotation) at the unbalanced node.',
    status: 'mastered'
  }
];
