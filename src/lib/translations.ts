import type { Lang } from './LanguageContext';

type T = Record<string, Record<Lang, string>>;

export const translations = {
  // ── Global ──────────────────────────────────────────────────
  gradeLabel:        { BN: 'নবম-দশম শ্রেণি: গণিত',  EN: 'Class 9-10: Math' },
  startTutorial:     { BN: 'টিউটোরিয়াল শুরু করি',   EN: 'Start Tutorial' },
  feedbackBtn:       { BN: 'তোমার মতামত জানাও',       EN: 'Share Feedback' },
  feedbackLoading:   { BN: 'ফর্ম লোড হচ্ছে…',         EN: 'Loading form…' },

  // ── Home page ────────────────────────────────────────────────
  heroTitle:         { BN: '১০এমএস ম্যাথ ল্যাবে স্বাগতম!',              EN: 'Welcome to 10MS Math Lab!' },
  heroSubtitle:      { BN: 'গণিতের রহস্য উন্মোচন করো — নিজে পরীক্ষা করে শেখো', EN: 'Unlock the mysteries of math — learn by exploring' },
  whatCanYouDo:      { BN: 'কি কি করা যাবে?',          EN: 'What can you do?' },

  trigCardTitle:     { BN: 'ত্রিকোণমিতি এক্সপ্লোরেশন', EN: 'Trigonometry Exploration' },
  trigCardDesc:      { BN: 'ইউনিট সার্কেল এবং সাইন-কোসাইন গ্রাফ সরাসরি পরিবর্তন করে শিখুন। রেডিয়ান ও ডিগ্রির সম্পর্ক জানুন।', EN: 'Learn by manipulating the unit circle and sin-cos graphs. Understand the relationship between radians and degrees.' },
  quadCardTitle:     { BN: 'দ্বিঘাত সমীকরণ ল্যাব', EN: 'Quadratic Equations Lab' },
  quadCardDesc:      { BN: 'প্যারাবোলা এবং এর সহগগুলোর প্রভাব রিয়েল-টাইমে পর্যবেক্ষণ করুন। শীর্ষবিন্দু ও মূল নির্ণয় করুন।', EN: 'Observe the effect of parabola coefficients in real-time. Find the vertex and roots.' },
  geomCardTitle:     { BN: 'জ্যামিতি ল্যাব (বৃত্ত)', EN: 'Geometry Lab (Circles)' },
  geomCardDesc:      { BN: 'বৃত্তের গুরুত্বপূর্ণ উপপাদ্যগুলো অ্যানিমেশনের মাধ্যমে ধাপে ধাপে শিখুন। ভিজ্যুয়াল প্রমাণ দেখুন।', EN: 'Learn important circle theorems step-by-step through animation. See visual proofs.' },

  quickStartTitle:   { BN: 'দ্রুত শুরু করুন (Quick Start)', EN: 'Quick Start' },
  qs1Title:          { BN: 'ত্রিকোণমিতি: ৩০° কোণ',    EN: 'Trigonometry: 30° Angle' },
  qs1Desc:           { BN: 'সরাসরি ৩০ ডিগ্রি মান দেখুন', EN: 'See 30-degree values directly' },
  qs2Title:          { BN: 'বীজগণিত: দ্বিঘাত সমীকরণ',  EN: 'Algebra: Quadratic Equation' },
  qs2Desc:           { BN: 'গ্রাফিং শুরু করুন',          EN: 'Start graphing' },
  qs3Title:          { BN: 'জ্যামিতি: বৃত্তের উপপাদ্য ১৮', EN: 'Geometry: Circle Theorem 18' },
  qs3Desc:           { BN: 'অ্যানিমেশন দেখুন',           EN: 'Watch animation' },

  // ── Sim header ───────────────────────────────────────────────
  simTitleTrig:      { BN: 'ইউনিট সার্কেল সিমুলেশন', EN: 'Unit Circle Simulation' },
  simTitleQuad:      { BN: 'দ্বিঘাত সমীকরণ ল্যাব',    EN: 'Quadratic Equations Lab' },
  simTitleGeom:      { BN: 'জ্যামিতি ল্যাব',           EN: 'Geometry Lab' },
  chapterTrig:       { BN: 'অধ্যায় ৮: ত্রিকোণমিতি',   EN: 'Chapter 8: Trigonometry' },
  chapterQuad:       { BN: 'অধ্যায় ৫: সমীকরণ',         EN: 'Chapter 5: Equations' },

  // ── Trig sim ────────────────────────────────────────────────
  setAngleLabel:     { BN: 'কোণের মান নির্ণয় করি',     EN: 'Set Angle' },
  anglePlaceholder:  { BN: 'মান লিখুন',                  EN: 'Enter value' },
  radSuffix:         { BN: ' ব্যাসার্ধ',                  EN: ' rad' },
  dragPoint:         { BN: 'বিন্দুটি টেনে কোণ পরিবর্তন করো', EN: 'Drag the point to change angle' },
  allValuesTitle:    { BN: 'কোণের মান অনুযায়ী সকল তথ্য',  EN: 'All values for this angle' },
  radianValue:       { BN: 'রেডিয়ান মান',               EN: 'Radian Value' },
  coordinateLabel:   { BN: 'স্থানাঙ্ক বিন্দু',            EN: 'Coordinate' },
  cosDesc:           { BN: 'ভূজ',                         EN: 'base' },
  sinDesc:           { BN: 'কোটি',                        EN: 'height' },
  tanDesc:           { BN: 'ঢাল',                         EN: 'slope' },
  settingsTitle:     { BN: 'সেটিংস',                      EN: 'Settings' },
  blinkLines:        { BN: 'X এবং Y রেখা ব্লিঙ্কিং',    EN: 'X & Y Line Blinking' },
  blinkArc:          { BN: 'রেডিয়ান রেখা ব্লিঙ্কিং',    EN: 'Radian Arc Blinking' },
  waveTitle:         { BN: 'Sin(সাইন) ও Cos(কোসাইন) এর গ্রাফ', EN: 'Sin & Cos Graph' },
  sinWave:           { BN: 'Sin(সাইন)',                   EN: 'Sin' },
  cosWave:           { BN: 'Cos(কোসাইন)',                 EN: 'Cos' },

  // ── Quadratic sim ────────────────────────────────────────────
  quadPageTitle:     { BN: 'দ্বিঘাত সমীকরণ গ্রাফিং',      EN: 'Quadratic Equation Graphing' },
  quadModeExplore:   { BN: 'অন্বেষণ (Explore)',            EN: 'Explore' },
  quadModeStandard:  { BN: 'সাধারণ আকার (Standard Form)',   EN: 'Standard Form' },
  quadModeVertex:    { BN: 'শীর্ষবিন্দু আকার (Vertex Form)', EN: 'Vertex Form' },
  quadModeFocus:     { BN: 'উপকেন্দ্র ও নিয়ামক (Focus & Directrix)', EN: 'Focus & Directrix' },
  quadCompare:       { BN: 'অন্যান্য মানের সাথে তুলনা করি', EN: 'Compare with other values' },
  quadClear:         { BN: 'মুছে ফেলি',                    EN: 'Clear' },
  quadChangeMode:    { BN: 'মোড পরিবর্তন করুন (Change Mode)', EN: 'Change Mode' },
  quadVertex:        { BN: 'শীর্ষবিন্দু (Vertex)',          EN: 'Vertex' },
  quadAoS:           { BN: 'প্রতিসাম্য অক্ষ (Axis of Symmetry)', EN: 'Axis of Symmetry' },
  quadEquations:     { BN: 'সমীকরণ (Equations)',            EN: 'Equations' },
  quadCoords:        { BN: 'স্থানাঙ্ক (Coordinates)',       EN: 'Coordinates' },
  quadFocus:         { BN: 'উপকেন্দ্র (Focus)',             EN: 'Focus' },
  quadDirectrix:     { BN: 'নিয়ামক (Directrix)',           EN: 'Directrix' },
  quadInfoTitle:     { BN: 'তথ্য (Information)',             EN: 'Information' },
  quadVertexLbl:     { BN: 'শীর্ষবিন্দু (Vertex):',        EN: 'Vertex:' },
  quadFocusLbl:      { BN: 'উপকেন্দ্র (Focus):',           EN: 'Focus:' },
  quadDirectrixLbl:  { BN: 'নিয়ামক (Directrix):',         EN: 'Directrix:' },
  quadYIntercept:    { BN: 'Y-ছেদক (Y-Intercept):',        EN: 'Y-Intercept:' },
  quadRoots:         { BN: 'মূল (Roots):',                  EN: 'Roots:' },
  quadNoRoots:       { BN: 'কোন বাস্তব মূল নেই (None)',    EN: 'No real roots' },

  // ── Geometry sim ─────────────────────────────────────────────
  geomPageTitle:     { BN: 'জ্যামিতির সকল আলোচনা',        EN: 'All Geometry Topics' },
  geomSelectChapter: { BN: 'চ্যাপ্টার নির্বাচন করুন',     EN: 'Select a Chapter' },
  geomSelectTheorem: { BN: 'উপপাদ্য নির্বাচন করুন',       EN: 'Select a Theorem' },
  geomAvailable:     { BN: 'টি উপপাদ্য উপলব্ধ',           EN: ' theorem(s) available' },

  geomBackChapters:  { BN: 'সকল অধ্যায়',                  EN: 'All Chapters' },
  geomComingSoon:    { BN: 'শীঘ্রই আসছে!',                 EN: 'Coming Soon!' },
  geomComingSoonDesc:{ BN: 'এই চ্যাপ্টার এর উপপাদ্যগুলো বর্তমানে তৈরি করা হচ্ছে। দয়া করে অপেক্ষা করুন।', EN: 'The theorems for this chapter are currently being developed. Please stay tuned.' },
  geomBackAll:       { BN: 'সকল জ্যামিতি আলোচনায় ফিরে যান', EN: 'Back to All Geometry' },
  geomBackChapter:   { BN: '-এ ফিরে যান',                  EN: 'Back to' },
  geomProofDone:     { BN: 'উপপাদ্যটি সফলভাবে প্রমাণিত হয়েছে!', EN: 'Theorem successfully proved!' },
  geomRestart:       { BN: 'আবার শুরু করুন',               EN: 'Restart' },
  geomPrev:          { BN: 'পূর্ববর্তী',                    EN: 'Previous' },
  geomNext:          { BN: 'পরবর্তী ধাপ',                  EN: 'Next Step' },
  geomFollowSteps:   { BN: 'নির্দেশনা অনুযায়ী ধাপগুলো অনুসরণ করুন', EN: 'Follow the steps as instructed' },

  // Chapter titles
  ch6Title:  { BN: 'অধ্যায় ৬ঃ রেখা, কোণ ও ত্রিভুজ',               EN: 'Chapter 6: Lines, Angles & Triangles' },
  ch8Title:  { BN: 'অধ্যায় ৮: বৃত্ত',                               EN: 'Chapter 8: Circles' },
  ch14Title: { BN: 'অধ্যায় ১৪ঃ অনুপাত, সদৃশতা ও প্রতিসমতা',        EN: 'Chapter 14: Ratio, Similarity & Symmetry' },
  ch15Title: { BN: 'অধ্যায় ১৫ঃ ক্ষেত্রফল সম্পর্কিত উপপাদ্য ও সম্পাদ্য', EN: 'Chapter 15: Area Theorems & Constructions' },

  // Theorem titles & descriptions
  th14Title: { BN: 'উপপাদ্য ১৪', EN: 'Theorem 14' },
  th14Desc:  { BN: 'ত্রিভুজের যেকোনো দুই বাহুর মধ্যবিন্দুর সংযোজক রেখাংশ তৃতীয় বাহুর সমান্তরাল এবং দৈর্ঘ্য তার অর্ধেক।', EN: 'The line segment joining the midpoints of any two sides of a triangle is parallel to the third side and half its length.' },
  th18Title: { BN: 'উপপাদ্য ১৮', EN: 'Theorem 18' },
  th18Desc:  { BN: 'বৃত্তের সকল সমান জ্যা কেন্দ্র থেকে সমদূরবর্তী।', EN: 'Equal chords of a circle are equidistant from the centre.' },
  th35Title: { BN: 'উপপাদ্য ৩৫', EN: 'Theorem 35' },
  th35Desc:  { BN: 'দুইটি সদৃশ ত্রিভুজক্ষেত্রের ক্ষেত্রফলদ্বয়ের অনুপাত এদের যেকোনো দুই অনুরূপ বাহুর উপর অঙ্কিত বর্গক্ষেত্রের ক্ষেত্রফলদ্বয়ের অনুপাতের সমান।', EN: 'The ratio of the areas of two similar triangles equals the ratio of the squares of any pair of corresponding sides.' },
  th38Title: { BN: 'উপপাদ্য ৩৮', EN: 'Theorem 38' },
  th38Desc:  { BN: 'পিথাগোরাসের উপপাদ্য: সমকোণী ত্রিভুজের অতিভুজের উপর অঙ্কিত বর্গক্ষেত্রের ক্ষেত্রফল অপর দুই বাহুর উপর অঙ্কিত বর্গক্ষেত্রদ্বয়ের ক্ষেত্রফলের সমষ্টির সমান ($ AB^2 = BC^2 + AC^2 $)।', EN: "Pythagoras' Theorem: The square on the hypotenuse of a right triangle equals the sum of the squares on the other two sides ($ AB^2 = BC^2 + AC^2 $)." },

  // ── Welcome Modal ───────────────────────────────────────────
  welcomeTitle:       { BN: 'স্বাগতম! 🎉', EN: 'Welcome! 🎉' },
  welcomeSubtitle:    { BN: '১০এমএস ম্যাথ ল্যাবে আপনাকে আন্তরিকভাবে স্বাগত জানাই।', EN: 'A warm welcome to 10MS Math Lab.' },
  welcomeBody:        { BN: 'তিনটি ইন্টারেক্টিভ ম্যাথ ল্যাব রয়েছে — রিয়েল-টাইমে সিমুলেশনে গণিত শেখো আনন্দের সাথে।', EN: 'Three interactive math labs await — learn math with joy through real-time simulations.' },
  welcomeDirectStart: { BN: 'সরাসরি শুরু করি', EN: 'Start Directly' },
  welcomeTakeTour:    { BN: 'ট্যুর নিন', EN: 'Take a Tour' },
  welcomeTrigLab:     { BN: 'ত্রিকোণমিতি ল্যাব', EN: 'Trigonometry Lab' },
  welcomeTrigDesc:    { BN: 'ইউনিট সার্কেল ও ত্রিকোণমিতিক অনুপাত', EN: 'Unit Circle & Trig Ratios' },
  welcomeAlgebraLab:  { BN: 'বীজগণিত ল্যাব', EN: 'Algebra Lab' },
  welcomeAlgebraDesc: { BN: 'দ্বিঘাত সমীকরণ ও প্যারাবোলা', EN: 'Quadratic Equations & Parabolas' },
  welcomeGeometryLab: { BN: 'জ্যামিতি ল্যাব', EN: 'Geometry Lab' },
  welcomeGeometryDesc: { BN: 'বৃত্তের উপপাদ্য ও অ্যানিমেশন', EN: 'Circle Theorems & Animation' },

  // ── Guided Tour UI ──────────────────────────────────────────
  tourStepLabel: { BN: 'ধাপ', EN: 'Step' },
  tourSkip:      { BN: 'বাদ দিন', EN: 'Skip' },
  tourFinish:    { BN: 'শেষ করুন', EN: 'Finish' },
  tourNext:      { BN: 'পরবর্তী', EN: 'Next' },

  // ── Tour Steps Content ──────────────────────────────────────
  tour1Title: { BN: '10MS ম্যাথ ল্যাবে স্বাগতম!', EN: 'Welcome to 10MS Math Lab!' },
  tour1Content: { BN: 'চলুন একটি দ্রুত ট্যুরে তিনটি সিমুলেশন ল্যাব ঘুরে দেখি। যেকোনো সময় স্কিপ করতে পারবেন।', EN: "Let's take a quick tour through our three simulation labs. You can skip anytime." },
  tour2Title: { BN: 'ল্যাব নির্বাচন করুন', EN: 'Select a Lab' },
  tour2Content: { BN: 'এই কার্ডগুলোতে ক্লিক করে তিনটি ভিন্ন ম্যাথ ল্যাবে প্রবেশ করা যাবে।', EN: 'Click these cards to enter three different math labs.' },
  tour3Title: { BN: 'দ্রুত শুরু করুন', EN: 'Quick Start' },
  tour3Content: { BN: 'নির্দিষ্ট বিষয় সরাসরি খুলতে Quick Start বাটনগুলো ব্যবহার করুন।', EN: 'Use Quick Start buttons to open specific topics directly.' },
  tour4Title: { BN: 'ত্রিকোণমিতি ল্যাব', EN: 'Trigonometry Lab' },
  tour4Content: { BN: 'এই কার্ডে ক্লিক করলে ইউনিট সার্কেল সিমুলেশন শুরু হবে যেখানে সাইন, কোসাইন ও ট্যানজেন্ট ইন্টারেক্টিভভাবে শেখা যাবে।', EN: 'Clicking this card starts the unit circle simulation where you can learn sine, cosine, and tangent interactively.' },
  tour5Title: { BN: 'কোণ নিয়ন্ত্রণ করুন', EN: 'Control the Angle' },
  tour5Content: { BN: 'এখানে কোণের মান টাইপ করুন অথবা ক্যানভাসে বিন্দুটি টেনে কোণ পরিবর্তন করুন।', EN: 'Type the angle value here or drag the point on the canvas to change the angle.' },
  tour6Title: { BN: 'ইউনিট সার্কেল', EN: 'Unit Circle' },
  tour6Content: { BN: 'এই বৃত্তের উপর বিন্দুটি ড্র্যাগ করুন। লাল বিন্দু দিয়ে কোণ পরিবর্তন হবে এবং সব মান রিয়েল-টাইমে আপডেট হবে।', EN: 'Drag the point on this circle. The red point changes the angle, and all values update in real-time.' },
  tour7Title: { BN: 'ত্রিকোণমিতিক মান', EN: 'Trigonometric Values' },
  tour7Content: { BN: 'cos θ, sin θ এবং tan θ এর মান এখানে দেখা যাবে। মান সরাসরি এডিট করেও কোণ পরিবর্তন করা সম্ভব!', EN: 'See cos θ, sin θ, and tan θ values here. You can even edit values directly to change the angle!' },
  tour8Title: { BN: 'সাইন ও কোসাইন গ্রাফ', EN: 'Sine & Cosine Graphs' },
  tour8Content: { BN: 'সবুজ রেখা সাইন এবং নীল রেখা কোসাইন দেখাচ্ছে। কোণ পরিবর্তন করলে লাল দাগ গ্রাফে সরে যাবে।', EN: 'The green line shows sine and the blue line shows cosine. Changing the angle moves the red marker on the graph.' },
  tour9Title: { BN: 'ভিজ্যুয়াল সেটিংস', EN: 'Visual Settings' },
  tour9Content: { BN: 'রেখার ব্লিংকিং চালু/বন্ধ করতে এই টগলগুলো ব্যবহার করুন।', EN: 'Use these toggles to turn line blinking on or off.' },
  tour10Title: { BN: 'বীজগণিত ল্যাব', EN: 'Algebra Lab' },
  tour10Content: { BN: 'এখন দ্বিঘাত সমীকরণ ল্যাবে আসা হয়েছে। এখানে প্যারাবোলার সহগ পরিবর্তন করে গ্রাফ রিয়েল-টাইমে পর্যবেক্ষণ করা যাবে।', EN: "We've moved to the Algebra lab. Here you can observe the parabola graph in real-time by changing its coefficients." },
  tour11Title: { BN: 'জ্যামিতি ল্যাব', EN: 'Geometry Lab' },
  tour11Content: { BN: 'সবশেষে জ্যামিতি ল্যাব! এখানে অধ্যায় ও উপপাদ্য নির্বাচন করে অ্যানিমেটেড ধাপে ধাপে প্রমাণ দেখা যাবে।', EN: 'Finally, the Geometry lab! Select a chapter and theorem to see animated step-by-step proofs.' },
  tour12Title: { BN: 'ট্যুর শেষ!', EN: 'Tour Complete!' },
  tour12Content: { BN: 'সফলভাবে ট্যুর সম্পন্ন করেছেন। এখন আপনার পছন্দমতো ল্যাব এক্সপ্লোর করা শুরু করুন!', EN: "You've successfully completed the tour. Now, start exploring your favorite lab!" },

  startSim: { BN: 'সিমুলেশন শুরু করুন', EN: 'Start Simulation' },
  positive: { BN: 'ধনাত্মক', EN: 'Positive' },
  negative: { BN: 'ঋণাত্মক', EN: 'Negative' },
  highMath: { BN: 'উচ্চতর গণিত', EN: 'Higher Math' },


  // Geometry Specific UI
  geomTitle: { BN: 'জ্যামিতির সকল আলোচনা', EN: 'Geometry Discussions' },
  geomChapterSubtitle: { BN: 'চ্যাপ্টার নির্বাচন করুন', EN: 'Select a Chapter' },
  geomTheoremsAvailable: { BN: 'টি উপপাদ্য উপলব্ধ', EN: 'Theorems Available' },
  
  ch6: { BN: 'অধ্যায় ৬ঃ রেখা, কোণ ও ত্রিভুজ', EN: 'Chapter 6: Lines, Angles & Triangles' },
  ch8: { BN: 'অধ্যায় ৮: বৃত্ত', EN: 'Chapter 8: Circle' },
  ch14: { BN: 'অধ্যায় ১৪ঃ অনুপাত, সদৃশতা ও প্রতিসমতা', EN: 'Chapter 14: Ratio, Similarity & Symmetry' },
  ch15: { BN: 'অধ্যায় ১৫ঃ ক্ষেত্রফল সম্পর্কিত উপপাদ্য ও সম্পাদ্য', EN: 'Chapter 15: Theorems & Related Constructions' },

  footer: { BN: '© 2026 10 Minute School | Science Division | SSC Prep', EN: '© 2026 10 Minute School | Science Division | SSC Prep' },

  // --- Theorem 14 Steps ---
  t14s0Title: { BN: "বিশেষ নির্বচন", EN: "General Enunciation" },
  t14s0Content: { BN: "মনে করি, ABC একটি ত্রিভুজ। D ও E যথাক্রমে ত্রিভুজটির AB ও AC বাহুর মধ্যবিন্দু। প্রমাণ করতে হবে যে, DE ∥ BC এবং DE = $ \\frac{1}{2} BC $।", EN: "Let ABC be a triangle. D and E are the midpoints of sides AB and AC respectively. It is required to prove that DE ∥ BC and DE = $ \\frac{1}{2} BC $." },
  t14s1Title: { BN: "অঙ্কন", EN: "Construction" },
  t14s1Content: { BN: "D ও E যোগ করে বর্ধিত করি যেন EF = DE হয়। এরপর C ও F যোগ করি।", EN: "Join D and E and extend it to F such that EF = DE. Join C and F." },
  t14s2Title: { BN: "প্রমাণ: ধাপ ১", EN: "Proof: Step 1" },
  t14s2Content: { BN: "∆ADE ও ∆CEF এর মধ্যে, \nAE = EC [দেওয়া আছে]\nDE = EF [অঙ্কনানুসারে]\nঅন্তর্ভুক্ত ∠AED = অন্তর্ভুক্ত ∠CEF [বিপ্রতীপ কোণ]\n∴ ∆ADE ≅ ∆CEF [বাহু-কোণ-বাহু উপপাদ্য]\n∴ ∠ADE = ∠EFC [একান্তর কোণ]\n∴ AD ∥ CF\nআবার, BD = AD = CF এবং BD ∥ CF।\nসুতরাং BDFC একটি সামান্তরিক।\n∴ DF ∥ BC বা $ DE \\parallel BC $।", EN: "In ∆ADE and ∆CEF, \nAE = EC [Given]\nDE = EF [By construction]\nIncluded ∠AED = Included ∠CEF [Vertically opposite]\n∴ ∆ADE ≅ ∆CEF [S-A-S Theorem]\n∴ ∠ADE = ∠EFC [Alternate angles]\n∴ AD ∥ CF\nAgain, BD = AD = CF and BD ∥ CF.\nSo, BDFC is a parallelogram.\n∴ DF ∥ BC or DE ∥ BC." },
  t14s3Title: { BN: "প্রমাণ: ধাপ ২", EN: "Proof: Step 2" },
  t14s3Content: { BN: "আবার, DF = BC বা DE + EF = BC\nবা DE + DE = BC বা 2DE = BC \nবা $ DE = \\frac{1}{2} BC $\n∴ DE ∥ BC এবং DE = $ \\frac{1}{2} BC $।", EN: "Again, DF = BC or DE + EF = BC\nor DE + DE = BC or 2DE = BC \nor DE = $ \\frac{1}{2} BC $\n∴ DE ∥ BC and DE = $ \\frac{1}{2} BC $." },

  // --- Theorem 18 Steps ---
  t18s0Title: { BN: "বিশেষ নির্বচন", EN: "General Enunciation" },
  t18s0Content: { BN: "মনে করি, O বৃত্তের কেন্দ্র এবং AB ও CD বৃত্তের দুইটি সমান জ্যা। প্রমাণ করতে হবে যে, O থেকে AB এবং CD জ্যাদ্বয় সমদূরবর্তী।", EN: "Let O be the center of the circle and AB, CD be two equal chords. It is required to prove that AB and CD are equidistant from the center O." },
  t18s1Title: { BN: "অঙ্কন", EN: "Construction" },
  t18s1Content: { BN: "O থেকে AB এবং CD জ্যা এর উপর যথাক্রমে OE এবং OF লম্ব রেখাংশ আঁকি। O, A এবং O, C যোগ করি।", EN: "Draw perpendiculars OE and OF from O to chords AB and CD respectively. Join O, A and O, C." },
  t18s2Title: { BN: "প্রমাণ: ধাপ ১", EN: "Proof: Step 1" },
  t18s2Content: { BN: "OE ⊥ AB এবং OF ⊥ CD সুতরাং, AE = BE এবং CF = DF [কেন্দ্র থেকে ব্যাস ভিন্ন যেকোনো জ্যা এর উপর অঙ্কিত লম্ব জ্যাকে সমদ্বিখন্ডিত করে]\n\n∴ $ AE = \\frac{1}{2} AB $ এবং $ CF = \\frac{1}{2} CD $", EN: "OE ⊥ AB and OF ⊥ CD. Therefore, AE = BE and CF = DF [The perpendicular from the center to a chord bisects the chord]\n\n∴ AE = $ \\frac{1}{2} AB $ and CF = $ \\frac{1}{2} CD $" },
  t18s3Title: { BN: "প্রমাণ: ধাপ ২", EN: "Proof: Step 2" },
  t18s3Content: { BN: "কিন্তু AB = CD [ধরে নেয়া]\n\n∴ AE = CF", EN: "But AB = CD [Given]\n\n∴ AE = CF" },
  t18s4Title: { BN: "প্রমাণ: ধাপ ৩", EN: "Proof: Step 3" },
  t18s4Content: { BN: "এখন ∆OAE এবং ∆OCF সমকোণী ত্রিভুজদ্বয়ের মধ্যে অতিভুজ OA = অতিভুজ OC [উভয়ে একই বৃত্তের ব্যাসার্ধ] এবং AE = CF [ধাপ ২]\n\n∴ ∆OAE ≅ ∆OCF [R-H-S Congruence]\n\n∴ OE = OF", EN: "Now in right triangles ∆OAE and ∆OCF, hypotenuse OA = hypotenuse OC [Radii of the same circle] and AE = CF [From Step 2]\n\n∴ ∆OAE ≅ ∆OCF [R-H-S Theorem]\n\n∴ OE = OF" },
  t18s5Title: { BN: "প্রমাণ: ধাপ ৪", EN: "Proof: Step 4" },
  t18s5Content: { BN: "কিন্তু OE এবং OF কেন্দ্র O থেকে যথাক্রমে AB জ্যা এবং CD জ্যা এর দূরত্ব।\n\nসুতরাং, AB এবং CD জ্যাদ্বয় বৃত্তের কেন্দ্র থেকে সমদূরবর্তী।", EN: "But OE and OF are the distances from center O to chords AB and CD respectively.\n\nTherefore, chords AB and CD are equidistant from the center of the circle." },

  // --- Theorem 35 Steps ---
  t35s0Title: { BN: "বিশেষ নির্বচন", EN: "General Enunciation" },
  t35s0Content: { BN: "মনে করি, ∆ABC ও ∆DEF ত্রিভুজদ্বয় সদৃশ এবং এদের অনুরূপ বাহু BC ও EF। প্রমাণ করতে হবে যে, $ \\text{Area}(\\Delta ABC) : \\text{Area}(\\Delta DEF) = BC^2 : EF^2 $।", EN: "Let ∆ABC and ∆DEF be similar triangles with corresponding sides BC and EF. It is required to prove that $ \\text{Area}(\\Delta ABC) : \\text{Area}(\\Delta DEF) = BC^2 : EF^2 $." },
  t35s1Title: { BN: "অঙ্কন", EN: "Construction" },
  t35s1Content: { BN: "BC ও EF এর উপর যথাক্রমে AG ও DH লম্ব আঁকি। মনে করি AG = h, DH = p।", EN: "Draw perpendiculars AG and DH to BC and EF respectively. Let AG = h, DH = p." },
  t35s2Title: { BN: "প্রমাণ: ধাপ ১", EN: "Proof: Step 1" },
  t35s2Content: { BN: "∆ABC = ½ × BC × h এবং ∆DEF = ½ × EF × p।\n\n∴ $ \\frac{\\text{Area}(\\Delta ABC)}{\\text{Area}(\\Delta DEF)} = \\frac{\\frac{1}{2} \\times BC \\times h}{\\frac{1}{2} \\times EF \\times p} = \\frac{h}{p} \\times \\frac{BC}{EF} $", EN: "Area(∆ABC) = ½ × BC × h and Area(∆DEF) = ½ × EF × p.\n\n∴ $ \\frac{\\text{Area}(\\Delta ABC)}{\\text{Area}(\\Delta DEF)} = \\frac{\\frac{1}{2} \\times BC \\times h}{\\frac{1}{2} \\times EF \\times p} = \\frac{h}{p} \\times \\frac{BC}{EF} $" },
  t35s3Title: { BN: "প্রমাণ: ধাপ ২", EN: "Proof: Step 2" },
  t35s3Content: { BN: "ABG ও DEH ত্রিভুজদ্বয়ের ∠B = ∠E, ∠AGB = ∠DHE [এক সমকোণ] ∴ ∠BAG = ∠EDH।\n\n∴ ∆ABG ও ∆DEH ত্রিভুজদ্বয় সদৃশকোণী, তাই সদৃশ।\n\n∴ $ \\frac{h}{p} = \\frac{AB}{DE} = \\frac{BC}{EF} $ [যেহেতু ∆ABC ও ∆DEF সদৃশ]", EN: "In triangles ∆ABG and ∆DEH, ∠B = ∠E, ∠AGB = ∠DHE [Right angle] ∴ ∠BAG = ∠EDH.\n\n∴ ∆ABG and ∆DEH are equiangular, hence similar.\n\n∴ $ \\frac{h}{p} = \\frac{AB}{DE} = \\frac{BC}{EF} $ [Since ∆ABC and ∆DEF are similar]" },
  t35s4Title: { BN: "প্রমাণ: ধাপ ৩", EN: "Proof: Step 3" },
  t35s4Content: { BN: "ধাপ ১ হতে পাই,\n$ \\frac{\\text{Area}(\\Delta ABC)}{\\text{Area}(\\Delta DEF)} $ = (h / p) × (BC / EF)\n\nধাপ ২ এর মান বসিয়ে,\n$ \\frac{\\text{Area}(\\Delta ABC)}{\\text{Area}(\\Delta DEF)} $ = (BC / EF) × (BC / EF) = $ BC^2 $ / $ EF^2 $\n\n∴ $ \\text{Area}(\\Delta ABC) : \\text{Area}(\\Delta DEF) = BC^2 : EF^2 $।", EN: "From Step 1,\n$ \\frac{\\text{Area}(\\Delta ABC)}{\\text{Area}(\\Delta DEF)} $ = (h / p) × (BC / EF)\n\nSubstituting value from Step 2,\n$ \\frac{\\text{Area}(\\Delta ABC)}{\\text{Area}(\\Delta DEF)} $ = (BC / EF) × (BC / EF) = $ BC^2 $ / $ EF^2 $\n\n∴ $ \\text{Area}(\\Delta ABC) : \\text{Area}(\\Delta DEF) = BC^2 : EF^2 $." },

  // --- Theorem 38 Steps ---
  t38s0Title: { BN: "বিশেষ নির্বচন", EN: "General Enunciation" },
  t38s0Content: { BN: "মনে করি, ABC সমকোণী ত্রিভুজের ∠C সমকোণ এবং অতিভুজ AB। প্রমাণ করতে হবে যে, $ AB^2 = BC^2 + AC^2 $।", EN: "Let ABC be a right-angled triangle with ∠C being the right angle and AB the hypotenuse. It is required to prove that $ AB^2 = BC^2 + AC^2 $." },
  t38s1Title: { BN: "অঙ্কন", EN: "Construction" },
  t38s1Content: { BN: "সমকৌণিক বিন্দু C থেকে অতিভুজ AB এর উপর CD লম্ব আঁকি।", EN: "Draw a perpendicular CD from the right-angled vertex C to the hypotenuse AB." },
  t38s2Title: { BN: "প্রমাণ: ধাপ ১", EN: "Proof: Step 1" },
  t38s2Content: { BN: "∆ADC ও ∆ACB এর মধ্যে ∠ADC = ∠ACB [সমকোণ] এবং ∠A সাধারণ। ∴ ∆ADC ও ∆ACB সদৃশ।\n\n∴ $ \\frac{AC}{AB} = \\frac{AD}{AC} $ বা $ AC^2 = AB \\times AD $", EN: "In ∆ADC and ∆ACB, ∠ADC = ∠ACB [Right angle] and ∠A is common. ∴ ∆ADC and ∆ACB are similar.\n\n∴ $ \\frac{AC}{AB} = \\frac{AD}{AC} $ or $ AC^2 = AB \\times AD $" },
  t38s3Title: { BN: "প্রমাণ: ধাপ ২", EN: "Proof: Step 2" },
  t38s3Content: { BN: "∆BDC ও ∆BCA এর মধ্যে ∠BDC = ∠BCA [সমকোণ] এবং ∠B সাধারণ। ∴ ∆BDC ও ∆BCA সদৃশ।\n\n∴ $ \\frac{BC}{AB} = \\frac{BD}{BC} $ বা $ BC^2 = AB \\times BD $", EN: "In ∆BDC and ∆BCA, ∠BDC = ∠BCA [Right angle] and ∠B is common. ∴ ∆BDC and ∆BCA are similar.\n\n∴ $ \\frac{BC}{AB} = \\frac{BD}{BC} $ or $ BC^2 = AB \\times BD $" },
  t38s4Title: { BN: "প্রমাণ: ধাপ ৩", EN: "Proof: Step 3" },
  t38s4Content: { BN: "ধাপ ১ ও ধাপ ২ যোগ করে পাই,\n$ AC^2 + BC^2 = (AB \\times AD) + (AB \\times BD) $\n\n= AB × (AD + BD) = AB × AB = $ AB^2 $\n\n∴ $ AB^2 = BC^2 + AC^2 $।", EN: "Adding Step 1 and Step 2,\n$ AC^2 + BC^2 = (AB \\times AD) + (AB \\times BD) $\n\n= AB × (AD + BD) = AB × AB = $ AB^2 $\n\n∴ $ AB^2 = BC^2 + AC^2 $." },
} satisfies T;



export type TKey = keyof typeof translations;

/** Quick translation helper */
export function tr(key: TKey, lang: Lang): string {
  return translations[key][lang];
}
