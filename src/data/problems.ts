import { Problem } from '../types';

export const PROBLEMS: Problem[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'Easy',
    topic: 'Arrays',
    acceptanceRate: '51.8%',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
      },
      {
        input: 'nums = [3,3], target = 6',
        output: '[0,1]'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    hints: [
      'Hint 1: A brute force approach checks every pair (nums[i], nums[j]), which takes O(n^2) time. Can you do better?',
      'Hint 2: For each number x, what value are you looking for? You are looking for target - x.',
      'Hint 3: Can you store previously seen elements in a hash map / dictionary for O(1) lookups?'
    ],
    starterCodes: {
      python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        # Write your code here
        pass
`,
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
    // Write your code here
}
`,
      java: `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        return new int[]{};
    }
}
`,
      cpp: `#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your code here
        return {};
    }
};
`
    },
    testCases: [
      { id: 1, input: 'nums = [2,7,11,15], target = 9', expectedOutput: '[0,1]' },
      { id: 2, input: 'nums = [3,2,4], target = 6', expectedOutput: '[1,2]' },
      { id: 3, input: 'nums = [3,3], target = 6', expectedOutput: '[0,1]' },
      { id: 4, input: 'nums = [-1,-2,-3,-4,-5], target = -8', expectedOutput: '[2,4]', isHidden: true }
    ]
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    difficulty: 'Easy',
    topic: 'Strings & Stacks',
    acceptanceRate: '40.6%',
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
      { input: 's = "([])"', output: 'true' }
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only "()[]{}"'
    ],
    hints: [
      'Hint 1: Use a stack data structure to keep track of opening brackets.',
      'Hint 2: When encountering a closing bracket, check if the stack is non-empty and the top matches the corresponding opener.',
      'Hint 3: After iterating through the string, the stack must be empty for the string to be valid.'
    ],
    starterCodes: {
      python: `class Solution:
    def isValid(self, s: str) -> bool:
        # Write your code here
        pass
`,
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
    // Write your code here
}
`,
      java: `import java.util.*;

class Solution {
    public boolean isValid(String s) {
        // Write your code here
        return false;
    }
}
`,
      cpp: `#include <string>
#include <stack>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        // Write your code here
        return false;
    }
};
`
    },
    testCases: [
      { id: 1, input: 's = "()"', expectedOutput: 'true' },
      { id: 2, input: 's = "()[]{}"', expectedOutput: 'true' },
      { id: 3, input: 's = "(]"', expectedOutput: 'false' },
      { id: 4, input: 's = "{[()]}()"', expectedOutput: 'true', isHidden: true }
    ]
  },
  {
    id: 'reverse-linked-list',
    title: 'Reverse Linked List',
    slug: 'reverse-linked-list',
    difficulty: 'Easy',
    topic: 'Linked Lists',
    acceptanceRate: '75.4%',
    description: `Given the \`head\` of a singly linked list, reverse the list, and return the reversed list.`,
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' },
      { input: 'head = [1,2]', output: '[2,1]' },
      { input: 'head = []', output: '[]' }
    ],
    constraints: [
      'The number of nodes in the list is the range [0, 5000].',
      '-5000 <= Node.val <= 5000'
    ],
    hints: [
      'Hint 1: Maintain three pointers: prev (initially null), curr (initially head), and next_temp.',
      'Hint 2: In a loop, save curr.next, reverse the link curr.next = prev, then shift prev = curr and curr = next_temp.',
      'Hint 3: Can you also solve this recursively?'
    ],
    starterCodes: {
      python: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def reverseList(self, head):
        # Write your code here
        pass
`,
      javascript: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
function reverseList(head) {
    // Write your code here
}
`,
      java: `class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

class Solution {
    public ListNode reverseList(ListNode head) {
        // Write your code here
        return null;
    }
}
`,
      cpp: `struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(nullptr) {}
};

class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        // Write your code here
        return nullptr;
    }
};
`
    },
    testCases: [
      { id: 1, input: 'head = [1,2,3,4,5]', expectedOutput: '[5,4,3,2,1]' },
      { id: 2, input: 'head = [1,2]', expectedOutput: '[2,1]' },
      { id: 3, input: 'head = []', expectedOutput: '[]' }
    ]
  },
  {
    id: 'maximum-subarray',
    title: 'Maximum Subarray (Kadane\'s Algorithm)',
    slug: 'maximum-subarray',
    difficulty: 'Medium',
    topic: 'Arrays & DP',
    acceptanceRate: '50.3%',
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum.

A subarray is a contiguous non-empty sequence of elements within an array.`,
    examples: [
      {
        input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        output: '6',
        explanation: 'The subarray [4,-1,2,1] has the largest sum 6.'
      },
      { input: 'nums = [1]', output: '1' },
      { input: 'nums = [5,4,-1,7,8]', output: '23' }
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4'
    ],
    hints: [
      'Hint 1: If you are at index i, should you add nums[i] to the running subarray or start a fresh subarray at nums[i]?',
      'Hint 2: Kadane\'s formula: current_max = max(nums[i], current_max + nums[i]).',
      'Hint 3: Keep track of global_max throughout the iteration.'
    ],
    starterCodes: {
      python: `class Solution:
    def maxSubArray(self, nums: list[int]) -> int:
        # Write your code here
        pass
`,
      javascript: `function maxSubArray(nums) {
    // Write your code here
}
`,
      java: `class Solution {
    public int maxSubArray(int[] nums) {
        // Write your code here
        return 0;
    }
}
`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        // Write your code here
        return 0;
    }
};
`
    },
    testCases: [
      { id: 1, input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6' },
      { id: 2, input: 'nums = [1]', expectedOutput: '1' },
      { id: 3, input: 'nums = [5,4,-1,7,8]', expectedOutput: '23' }
    ]
  },
  {
    id: 'longest-substring-without-repeating-characters',
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    difficulty: 'Medium',
    topic: 'Strings & Sliding Window',
    acceptanceRate: '34.2%',
    description: `Given a string \`s\`, find the length of the longest substring without repeating characters.`,
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.'
      },
      {
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.'
      },
      {
        input: 's = "pwwkew"',
        output: '3',
        explanation: 'The answer is "wke", with the length of 3.'
      }
    ],
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.'
    ],
    hints: [
      'Hint 1: Use a sliding window defined by [left, right] pointers.',
      'Hint 2: Store the last observed index of each character in a map.',
      'Hint 3: When character s[right] is already in the window, advance left pointer to lastIndex + 1.'
    ],
    starterCodes: {
      python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        # Write your code here
        pass
`,
      javascript: `function lengthOfLongestSubstring(s) {
    // Write your code here
}
`,
      java: `import java.util.*;

class Solution {
    public int lengthOfLongestSubstring(String s) {
        // Write your code here
        return 0;
    }
}
`,
      cpp: `#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        // Write your code here
        return 0;
    }
};
`
    },
    testCases: [
      { id: 1, input: 's = "abcabcbb"', expectedOutput: '3' },
      { id: 2, input: 's = "bbbbb"', expectedOutput: '1' },
      { id: 3, input: 's = "pwwkew"', expectedOutput: '3' },
      { id: 4, input: 's = " "', expectedOutput: '1', isHidden: true }
    ]
  },
  {
    id: 'coin-change',
    title: 'Coin Change',
    slug: 'coin-change',
    difficulty: 'Medium',
    topic: 'Dynamic Programming',
    acceptanceRate: '43.1%',
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

You may assume that you have an infinite number of each kind of coin.`,
    examples: [
      { input: 'coins = [1,2,5], amount = 11', output: '3', explanation: '11 = 5 + 5 + 1' },
      { input: 'coins = [2], amount = 3', output: '-1' },
      { input: 'coins = [1], amount = 0', output: '0' }
    ],
    constraints: [
      '1 <= coins.length <= 12',
      '1 <= coins[i] <= 2^31 - 1',
      '0 <= amount <= 10^4'
    ],
    hints: [
      'Hint 1: Define dp[i] as the minimum coins needed to make amount i.',
      'Hint 2: Initialize dp array of size amount + 1 with infinity or amount + 1, and dp[0] = 0.',
      'Hint 3: For each coin in coins and each x from coin to amount: dp[x] = min(dp[x], dp[x - coin] + 1).'
    ],
    starterCodes: {
      python: `class Solution:
    def coinChange(self, coins: list[int], amount: int) -> int:
        # Write your code here
        pass
`,
      javascript: `function coinChange(coins, amount) {
    // Write your code here
}
`,
      java: `import java.util.Arrays;

class Solution {
    public int coinChange(int[] coins, int amount) {
        // Write your code here
        return -1;
    }
}
`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        // Write your code here
        return -1;
    }
};
`
    },
    testCases: [
      { id: 1, input: 'coins = [1,2,5], amount = 11', expectedOutput: '3' },
      { id: 2, input: 'coins = [2], amount = 3', expectedOutput: '-1' },
      { id: 3, input: 'coins = [1], amount = 0', expectedOutput: '0' }
    ]
  },
  {
    id: 'binary-tree-level-order-traversal',
    title: 'Binary Tree Level Order Traversal',
    slug: 'binary-tree-level-order-traversal',
    difficulty: 'Medium',
    topic: 'Trees & BFS',
    acceptanceRate: '66.8%',
    description: `Given the \`root\` of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).`,
    examples: [
      { input: 'root = [3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]' },
      { input: 'root = [1]', output: '[[1]]' },
      { input: 'root = []', output: '[]' }
    ],
    constraints: [
      'The number of nodes in the tree is in the range [0, 2000].',
      '-1000 <= Node.val <= 1000'
    ],
    hints: [
      'Hint 1: Breadth-First Search (BFS) using a Queue is standard for level order traversals.',
      'Hint 2: Inside the while loop, record the current queue size to process all nodes of that exact level before proceeding.',
      'Hint 3: Push child nodes (left then right) into the queue.'
    ],
    starterCodes: {
      python: `class Solution:
    def levelOrder(self, root):
        # Write your code here
        pass
`,
      javascript: `function levelOrder(root) {
    // Write your code here
}
`,
      java: `import java.util.*;

class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        // Write your code here
        return new ArrayList<>();
    }
}
`,
      cpp: `#include <vector>
#include <queue>
using namespace std;

class Solution {
public:
    vector<vector<int>> levelOrder(TreeNode* root) {
        // Write your code here
        return {};
    }
};
`
    },
    testCases: [
      { id: 1, input: 'root = [3,9,20,null,null,15,7]', expectedOutput: '[[3],[9,20],[15,7]]' },
      { id: 2, input: 'root = [1]', expectedOutput: '[[1]]' },
      { id: 3, input: 'root = []', expectedOutput: '[]' }
    ]
  },
  {
    id: 'trapping-rain-water',
    title: 'Trapping Rain Water',
    slug: 'trapping-rain-water',
    difficulty: 'Hard',
    topic: 'Two Pointers & Stack',
    acceptanceRate: '60.5%',
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.`,
    examples: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6' },
      { input: 'height = [4,2,0,3,2,5]', output: '9' }
    ],
    constraints: [
      'n == height.length',
      '1 <= n <= 2 * 10^4',
      '0 <= height[i] <= 10^5'
    ],
    hints: [
      'Hint 1: The water trapped above index i is min(maxLeft, maxRight) - height[i].',
      'Hint 2: You can compute maxLeft and maxRight prefix/suffix arrays in O(n) space.',
      'Hint 3: Can you optimize to O(1) space using two pointers moving inward from both ends?'
    ],
    starterCodes: {
      python: `class Solution:
    def trap(self, height: list[int]) -> int:
        # Write your code here
        pass
`,
      javascript: `function trap(height) {
    // Write your code here
}
`,
      java: `class Solution {
    public int trap(int[] height) {
        // Write your code here
        return 0;
    }
}
`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int trap(vector<int>& height) {
        // Write your code here
        return 0;
    }
};
`
    },
    testCases: [
      { id: 1, input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', expectedOutput: '6' },
      { id: 2, input: 'height = [4,2,0,3,2,5]', expectedOutput: '9' }
    ]
  }
];
