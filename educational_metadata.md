# K-12 Educational Simulation Metadata & Routing Configuration

This document contains highly optimized configuration elements for the Math Laboratory (Trigonometry Unit Circle) application, aligned with the K-12 NCTB curriculum. It includes educational image metadata, URL parameter schemas, and dynamic URL building instructions.

---

## 1. Curriculum-Aligned Educational Image/Section Metadata

```json
[
  {
    "title": "Trigonometry Unit Circle Simulator",
    "description": "This interactive unit circle visualization helps students understand the relationship between circular motion and trigonometric functions. It is essential for learning angle values, signs in different quadrants, and how sine/cosine waves are generated for SSC and HSC exams. (এই ইন্টারঅ্যাক্টিভ ইউনিট সার্কেল সিমুলেশনটি বৃত্তাকার গতি এবং ত্রিকোণমিতিক ফাংশনের মধ্যে সম্পর্ক বুঝতে সাহায্য করে। এটি কোণের মান, বিভিন্ন চতুর্ভাগে চিহ্নের পরিবর্তন এবং সাইন/কোসাইন গ্রাফ তৈরির প্রক্রিয়া শেখার জন্য অপরিহার্য।)",
    "keywords": "trigonometry, unit circle, sine, cosine, quadrant, radians, degrees, circular motion, ত্রিকোণমিতি, ইউনিট সার্কেল, সাইন, কোসাইন, চতুর্ভাগ, রেডিয়ান, ডিগ্রি, কোণের মান, বৃত্তাকার গতি",
    "grades": "class-9,ssc,hsc",
    "subjects": "math,higher-math",
    "topic": "trigonometry-unit-circle"
  },
  {
    "title": "Quadratic Equation & Parabola Simulator",
    "description": "Visualize how changing coefficients (a, b, c) affects the shape and vertex of a parabola in real-time. This lab is crucial for mastering roots, vertex positioning, and solving quadratic equations graphically according to the NCTB curriculum. (কোফিশিয়েন্ট (a, b, c) পরিবর্তনের সাথে প্যারাবোলার আকৃতি এবং অবস্থানের পরিবর্তন এখানে দেখা যায়। এটি মূল (roots), শীর্ষবিন্দু (vertex) এবং লেখচিত্রের মাধ্যমে দ্বিঘাত সমীকরণ সমাধান শেখার জন্য অত্যন্ত গুরুত্বপূর্ণ।)",
    "keywords": "quadratic equation, parabola, vertex, roots, coefficients, graphing, algebra, দ্বিঘাত সমীকরণ, প্যারাবোলা, মূল, শীর্ষবিন্দু, লেখচিত্র, বীজগণিত",
    "grades": "class-9,ssc,hsc",
    "subjects": "math,higher-math",
    "topic": "quadratic-equation-graph"
  },
  {
    "title": "NCTB Circle Geometry Theorems",
    "description": "Explore interactive visual proofs of NCTB Grade 8 circle theorems, including chord properties and distance from center. These simulations help students visualize abstract geometric concepts for better retention and theorem mastery. (এনসিটিবি অষ্টম শ্রেণির বৃত্ত সংক্রান্ত উপপাদ্যগুলোর ইন্টারঅ্যাক্টিভ ভিজ্যুয়াল প্রমাণ এখানে দেওয়া হয়েছে। এই সিমুলেশনগুলো শিক্ষার্থীদের বিমূর্ত জ্যামিতিক ধারণাগুলো সহজে বুঝতে এবং উপপাদ্য আয়ত্ত করতে সাহায্য করে।)",
    "keywords": "geometry, circle, theorem, chord, perpendicular, proof, NCTB math, জ্যামিতি, বৃত্ত, উপপাদ্য, জ্যা, লম্ব, জ্যামিতিক প্রমাণ, অষ্টম শ্রেণির গণিত",
    "grades": "class-8,class-9,ssc",
    "subjects": "math,higher-math",
    "topic": "circle-geometry-theorems"
  }
]
```

---

## 2. URL Parameter Schemas & Building Instructions

### URL 1: Trigonometry Unit Circle Simulation
* **URL:** `https://trigonometry-unit-circle.vercel.app/?lang=BN&sim=trig`

```json
{
  "sim": {
    "type": "string",
    "allowed_values": ["trig"],
    "aliases": ["mode", "simulation", "view", "trigonometry", "unit_circle"]
  }
}
```
If the student asks about trigonometry, the unit circle, trigonometric functions, angles, radians, degrees, circular motion, or calculating coordinate values like $(\cos\theta, \sin\theta)$, set sim to trig to directly open that state. If no specific option is mentioned, or if they ask about the topic generally, provide the base URL.

---

### URL 2: Quadratic Equation Simulation
* **URL:** `https://trigonometry-unit-circle.vercel.app/?lang=BN&sim=quad`

```json
{
  "sim": {
    "type": "string",
    "allowed_values": ["quad"],
    "aliases": ["mode", "simulation", "view", "quadratic", "parabola"]
  }
}
```
If the student asks about quadratic equations, parabolas, equation coefficients, finding real or complex roots, vertex calculations, graphing $ax^2 + bx + c = 0$, or standard algebraic equations, set sim to quad to directly open that state. If no specific option is mentioned, or if they ask about the topic generally, provide the base URL.

---

### URL 3: Circle Geometry Theorems
* **URL:** `https://trigonometry-unit-circle.vercel.app/?lang=BN&sim=geom`

```json
{
  "sim": {
    "type": "string",
    "allowed_values": ["geom"],
    "aliases": ["mode", "simulation", "view", "geometry", "theorem"]
  }
}
```
If the student asks about geometry, circle theorems, NCTB Class 8 math proofs, chords, perpendiculars, equal distance properties, or interactive geometric proofs, set sim to geom to directly open that state. If no specific option is mentioned, or if they ask about the topic generally, provide the base URL.
