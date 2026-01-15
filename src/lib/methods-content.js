/**
 * Japan Method - Methods Content Data
 * Contains all method definitions and content for the quiz and results
 */

window.JapanMethodData = {
  methods: {
    '5s': {
      id: '5s',
      name: '5S System',
      japanese: '5S',
      description: 'The 5S System is your ideal starting point. This workplace organization methodology will help you create an efficient, clutter-free environment that supports peak productivity.',
      shortDescription: 'Sort, Set in order, Shine, Standardize, Sustain. A systematic approach to workplace organization.',
      principles: [
        'Sort (Seiri) - Remove unnecessary items',
        'Set in Order (Seiton) - Organize remaining items',
        'Shine (Seiso) - Clean and maintain the workspace',
        'Standardize (Seiketsu) - Create standards and procedures',
        'Sustain (Shitsuke) - Maintain and review standards'
      ],
      implementationSteps: [
        'Sort through your workspace, keeping only essential items',
        'Set everything in order with designated places',
        'Shine your space with regular cleaning routines',
        'Standardize your organization system',
        'Sustain through daily habits and audits'
      ],
      tags: ['Organization', 'Workspace', 'Efficiency'],
      bestFor: 'Physical space organization, workplace efficiency'
    },
    'kaizen': {
      id: 'kaizen',
      name: 'Kaizen',
      japanese: 'kaizen',
      description: 'Kaizen is the philosophy of continuous improvement through small, daily changes. Rather than dramatic overhauls, focus on steady, sustainable progress that compounds over time.',
      shortDescription: 'Continuous improvement through small, daily changes. The philosophy behind Japan\'s industrial success.',
      principles: [
        'Focus on small, incremental improvements',
        'Everyone participates in the improvement process',
        'Change is continuous, not a one-time event',
        'Base decisions on data and observation',
        'Standardize successful improvements'
      ],
      implementationSteps: [
        'Identify one small area for improvement today',
        'Make a tiny change that takes less than 5 minutes',
        'Observe the results over the next few days',
        'Keep what works, adjust what doesn\'t',
        'Repeat daily, building momentum'
      ],
      tags: ['Improvement', 'Habits', 'Growth'],
      bestFor: 'Long-term habit building, process improvement'
    },
    'konmari': {
      id: 'konmari',
      name: 'KonMari Method',
      japanese: 'konmari',
      description: 'The KonMari Method helps you transform your living space by keeping only items that spark joy. This category-by-category approach declutters your physical and emotional environment.',
      shortDescription: 'Keep only what sparks joy. Marie Kondo\'s method for decluttering and organizing your life.',
      principles: [
        'Commit to tidying up completely',
        'Imagine your ideal lifestyle',
        'Finish discarding first, then organize',
        'Tidy by category, not by location',
        'Follow the right order: clothes, books, papers, misc, sentimental'
      ],
      implementationSteps: [
        'Gather all items in a single category',
        'Hold each item and ask: does this spark joy?',
        'Thank items you\'re letting go of',
        'Find a proper home for items you keep',
        'Maintain by returning items to their home'
      ],
      tags: ['Decluttering', 'Home', 'Minimalism'],
      bestFor: 'Home organization, emotional decluttering'
    },
    'ikigai': {
      id: 'ikigai',
      name: 'Ikigai',
      japanese: 'ikigai',
      description: 'Ikigai helps you discover your reason for being. It sits at the intersection of what you love, what you\'re good at, what the world needs, and what you can be paid for.',
      shortDescription: 'Find your reason for being. Discover the intersection of passion, mission, vocation, and profession.',
      principles: [
        'What you love (Passion)',
        'What you are good at (Profession)',
        'What the world needs (Mission)',
        'What you can be paid for (Vocation)',
        'Your Ikigai lies at the intersection of all four'
      ],
      implementationSteps: [
        'List everything you love doing',
        'Identify your strongest skills and talents',
        'Research what the world needs that you can provide',
        'Explore how to monetize your contributions',
        'Find activities that overlap all four areas'
      ],
      tags: ['Purpose', 'Career', 'Fulfillment'],
      bestFor: 'Career direction, life purpose, fulfillment'
    },
    'pomodoro': {
      id: 'pomodoro',
      name: 'Pomodoro (Japanese Style)',
      japanese: 'pomodoro',
      description: 'The Pomodoro Technique enhanced with Japanese focus principles. Work in focused bursts with mindful breaks to maintain peak concentration throughout the day.',
      shortDescription: 'Time-boxing technique enhanced with Japanese focus principles and mindful breaks.',
      principles: [
        'Work in focused 25-minute intervals',
        'Take short 5-minute breaks between sessions',
        'Every 4 pomodoros, take a longer 15-30 minute break',
        'One task per pomodoro - no multitasking',
        'Use breaks for mindful rest, not more stimulation'
      ],
      implementationSteps: [
        'Choose a single task to focus on',
        'Set a timer for 25 minutes',
        'Work without interruption until the timer rings',
        'Take a 5-minute break with gentle movement or breathing',
        'After 4 cycles, take a 15-30 minute restorative break'
      ],
      tags: ['Focus', 'Time', 'Deep Work'],
      bestFor: 'Focus enhancement, time management, deep work'
    },
    'omoiyari': {
      id: 'omoiyari',
      name: 'Omoiyari',
      japanese: 'omoiyari',
      description: 'Omoiyari is the Japanese concept of considerate thinking - anticipating others\' needs before they express them. Apply this to teamwork and leadership for harmonious productivity.',
      shortDescription: 'The art of considerate thinking and anticipating others\' needs in work and life.',
      principles: [
        'Consider others\' perspectives before acting',
        'Anticipate needs before they are expressed',
        'Create environments where others can thrive',
        'Practice active listening and observation',
        'Build trust through consistent consideration'
      ],
      implementationSteps: [
        'Observe your colleagues\' working styles',
        'Anticipate what they might need before meetings',
        'Prepare resources others might find helpful',
        'Communicate proactively to reduce uncertainty',
        'Create systems that make others\' work easier'
      ],
      tags: ['Teamwork', 'Empathy', 'Leadership'],
      bestFor: 'Team collaboration, leadership, relationship building'
    }
  },

  // Quiz questions
  questions: [
    {
      id: 1,
      text: "What's your primary goal for improving productivity?",
      options: [
        { value: 'organization', text: 'Organizing my physical space and belongings', methods: ['5s', 'konmari'] },
        { value: 'habits', text: 'Building better daily habits and routines', methods: ['kaizen', 'pomodoro'] },
        { value: 'declutter', text: 'Simplifying and decluttering my life', methods: ['konmari', '5s'] },
        { value: 'purpose', text: 'Finding meaning and direction in my work', methods: ['ikigai', 'omoiyari'] }
      ]
    },
    {
      id: 2,
      text: 'How do you prefer to approach change?',
      options: [
        { value: 'small', text: 'Small, incremental steps over time', methods: ['kaizen', 'pomodoro'] },
        { value: 'dramatic', text: 'Big, transformative overhauls', methods: ['konmari', '5s'] },
        { value: 'structured', text: 'Following a detailed, structured system', methods: ['5s', 'pomodoro'] },
        { value: 'intuitive', text: 'Following my intuition and feelings', methods: ['konmari', 'ikigai'] }
      ]
    },
    {
      id: 3,
      text: 'What environment do you primarily want to improve?',
      options: [
        { value: 'workspace', text: 'My office or work area', methods: ['5s', 'pomodoro'] },
        { value: 'home', text: 'My home and living spaces', methods: ['konmari', '5s'] },
        { value: 'career', text: 'My career and professional direction', methods: ['ikigai', 'omoiyari'] },
        { value: 'habits', text: 'My daily habits and routines', methods: ['kaizen', 'pomodoro'] }
      ]
    },
    {
      id: 4,
      text: 'How do you make decisions about what to keep or change?',
      options: [
        { value: 'emotional', text: 'Based on how things make me feel', methods: ['konmari', 'ikigai'] },
        { value: 'practical', text: 'Based on practical usefulness', methods: ['5s', 'kaizen'] },
        { value: 'others', text: 'Considering impact on others', methods: ['omoiyari', 'kaizen'] },
        { value: 'data', text: 'Based on data and measurable results', methods: ['kaizen', 'pomodoro'] }
      ]
    },
    {
      id: 5,
      text: 'What aspect of productivity is most challenging for you?',
      options: [
        { value: 'focus', text: 'Staying focused on one task', methods: ['pomodoro', 'kaizen'] },
        { value: 'clutter', text: 'Managing physical clutter', methods: ['5s', 'konmari'] },
        { value: 'direction', text: 'Knowing what to prioritize', methods: ['ikigai', 'omoiyari'] },
        { value: 'consistency', text: 'Maintaining consistent habits', methods: ['kaizen', '5s'] }
      ]
    }
  ]
};
