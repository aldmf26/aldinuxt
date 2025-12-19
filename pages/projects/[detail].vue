<template>
  <div v-motion-fade class="min-h-screen py-8 md:py-16">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Back Button -->
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-12 group"
      >
        <svg
          class="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span class="text-sm font-medium">Back to Projects</span>
      </NuxtLink>

      <!-- Project Header - Centered -->
      <div class="mb-16 text-center">
        <h1 class="acorn500 text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          <div v-if="project.title === 'AgaFood'">
            <img
              src="\public\projects\tkmr.png"
              class="inline"
              width="120"
              alt="Project Logo"
            />
            {{ project.title }}
            <img
              src="\public\projects\sdb.png"
              class="inline"
              width="120"
              alt="Project Logo"
            />
          </div>
          <div v-else>
            <img
              :src="project.logoUrl"
              class="inline"
              :width="project.width"
              alt="Project Logo"
            />
            {{ project.title }}
          </div>
        </h1>
        <p class="text-2xl text-gray-600 mb-6 max-w-2xl mx-auto">
          {{ project.subtitle }}
          
          <div class="flex flex-wrap gap-3 mt-2 justify-center">
          <span
            v-for="tech in project.techs"
            :key="tech"
            class="px-3 py-1 bg-slate-600 text-white text-xs rounded-lg"
          >
            {{ tech }}
          </span>

        </div>
        </p>
        <!-- Visit Link -->
        <a
          v-if="project.link"
          :href="project.link"
          target="_blank"
          class="inline-flex items-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all hover:scale-105 group text-lg font-medium"
        >
          <span>Visit Project</span>
          <svg
            class="w-5 h-5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>

      <!-- Overview - Centered -->
      <section class="mb-16">
        <h2 class="acorn500 text-3xl font-bold text-gray-900 text-center">
          Overview
        </h2>

        <p
          class="text-gray-700 leading-relaxed text-xl text-center max-w-2xl mx-auto"
        >
          {{ project.description }}
        </p>
      </section>

      

      <!-- Project Screenshots with Descriptions -->
      <section class="space-y-20 mb-20">
        <div
          v-for="(screenshot, index) in project.screenshots"
          :key="index"
          class="space-y-6"
        >
          <div class="relative overflow-hidden rounded-2xl shadow-2xl bg-white">
            <img
              :src="screenshot.image"
              :alt="screenshot.title"
              class="w-full h-auto object-cover"
            />
          </div>
          <div class="text-center max-w-2xl mx-auto">
            <h3 class="acorn500 text-2xl font-bold text-gray-900 mb-3">
              {{ screenshot.title }}
            </h3>
            <p class="text-gray-600 leading-relaxed text-lg">
              {{ screenshot.description }}
            </p>
          </div>
        </div>
      </section>

      <!-- Features - Centered -->
      <section class="mb-20">
        <h2 class="acorn500 text-3xl font-bold text-gray-900 mb-8 text-center">
          Key Features
        </h2>
        <ul class="space-y-5 max-w-2xl mx-auto">
          <li
            v-for="(feature, index) in project.features"
            :key="index"
            class="flex items-start gap-4 text-gray-700"
          >
            <svg
              class="w-7 h-7 flex-shrink-0 mt-1"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.5 12.5L10.5 14.5L15.5 9.5"
                stroke="#1F2937"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7"
                stroke="#1F2937"
                stroke-width="1.5"
                stroke-linecap="round"
              ></path>
            </svg>
            <span class="text-lg leading-relaxed">{{ feature }}</span>
          </li>
        </ul>
      </section>

      <!-- Divider -->
      <div class="border-t border-gray-300 my-16"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const projectDetail = route.params.detail;

// Data projects
const projectsData = {
  agrika: {
    logoUrl: "https://sarang.ptagafood.com/assets/login/img/logo_agrika.png",
    width: "120",
    title: "Agrika Gatya Arum",
    subtitle:
      "Landing page website for exporting Birdnest, a premium quality Indonesian coffee",
    description:
      "Landing page website for exporting Birdnest, a premium quality Indonesian coffee",
    techs: ["Laravel", "Jquery", "Bootstrap 5", "MySQL"],
    link: "https://ptagrikagatyaarum.com/",
    imgLink: "agrika.png",
    year: "2024",
    role: "Full Stack Developer",
    screenshots: [
      {
        image:
          "https://placehold.co/1200x800/e0e7ff/6366f1?text=Agrika+Dashboard",
        title: "Agrika Dashboard",
        description:
          "The main dashboard provides an intuitive overview of the company, featuring a timeline view that makes it easy to navigate through different eras and civilizations.",
      },
      {
        image:
          "https://placehold.co/1200x800/ddd6fe/9333ea?text=Coffee+Figures",
        title: "Coffee Figures Database",
        description:
          "Comprehensive profiles of coffee figures throughout history, complete with biographical information, key achievements, and their impact on world events.",
      },
      {
        image:
          "https://placehold.co/1200x800/fce7f3/ec4899?text=Search+%26+Filter",
        title: "Advanced Search & Filtering",
        description:
          "Powerful search capabilities allow users to quickly find specific coffee events, figures, or theories. Multiple filter options help narrow down results by era, region, or category.",
      },
    ],
    features: [
      "Interactive timeline of coffee events with zoom and pan capabilities",
      "Comprehensive database of coffee figures with detailed profiles",
      "Advanced search and filter functionality for quick information access",
      "Responsive design optimized for all devices from mobile to desktop",
      "Fast performance powered by Laravel with server-side rendering",
      "Clean and intuitive user interface designed for educational purposes",
    ],
  },
  teory: {
    logoUrl: "https://alditeori.vercel.app/_nuxt/man.5139a8dc.png",
    width: "70",
    title: "Aldi Teori",
    subtitle: "Theory & History Application",
    description:
      "A comprehensive theory application about historical figures and civilizations. This platform serves as an educational resource for students and history enthusiasts to explore and learn about significant historical events, figures, and theories that shaped our world.",
    techs: ["Nuxt 3", "Tailwind CSS", "Daisy UI"],
    link: "https://alditeori.vercel.app/",
    year: "2024",
    role: "Full Stack Developer",
    screenshots: [
      {
        image:
          "https://placehold.co/1200x800/e0e7ff/6366f1?text=Theory+Dashboard",
        title: "Interactive Dashboard",
        description:
          "The main dashboard provides an intuitive overview of historical periods, featuring a timeline view that makes it easy to navigate through different eras and civilizations.",
      },
      {
        image:
          "https://placehold.co/1200x800/ddd6fe/9333ea?text=Historical+Figures",
        title: "Historical Figures Database",
        description:
          "Comprehensive profiles of influential figures throughout history, complete with biographical information, key achievements, and their impact on world events.",
      },
      {
        image:
          "https://placehold.co/1200x800/fce7f3/ec4899?text=Search+%26+Filter",
        title: "Advanced Search & Filtering",
        description:
          "Powerful search capabilities allow users to quickly find specific historical events, figures, or theories. Multiple filter options help narrow down results by era, region, or category.",
      },
    ],
    features: [
      "Interactive timeline of historical events with zoom and pan capabilities",
      "Comprehensive database of historical figures with detailed profiles",
      "Advanced search and filter functionality for quick information access",
      "Responsive design optimized for all devices from mobile to desktop",
      "Fast performance powered by Nuxt 3 with server-side rendering",
      "Clean and intuitive user interface designed for educational purposes",
    ],
  },
  translation: {
    logoUrl: "https://terjemahan.klinikhappykids.com/img/logo.png",
    width: "100",
    title: "Translation App",
    subtitle: "Indonesian-Dayak Language Translator",
    description:
      "An innovative translation application bridging Indonesian and Dayak languages. This tool aims to preserve and promote the Dayak language and culture by making it accessible to younger generations and language enthusiasts, supporting cultural heritage preservation.",
    techs: ["Tailwind CSS", "Alpine JS", "Laravel", "Livewire"],
    link: "https://terjemahan.klinikhappykids.com/",
    year: "2024",
    role: "Full Stack Developer",
    screenshots: [
      {
        image:
          "https://placehold.co/1200x800/dcfce7/16a34a?text=Translation+Interface",
        title: "Translation Interface",
        description:
          "Clean and simple translation interface with bidirectional support. Users can easily switch between Indonesian and Dayak languages with a single click.",
      },
      {
        image: "https://placehold.co/1200x800/fef3c7/eab308?text=Word+Database",
        title: "Comprehensive Word Database",
        description:
          "Access to an extensive database of Dayak words and phrases, complete with pronunciation guides and usage examples to help learners understand context.",
      },
      {
        image:
          "https://placehold.co/1200x800/fed7aa/f97316?text=Real-time+Results",
        title: "Real-time Translation",
        description:
          "Instant translation results powered by Livewire, providing immediate feedback as users type. The system learns from usage patterns to improve accuracy over time.",
      },
    ],
    features: [
      "Bidirectional translation between Indonesian and Dayak languages",
      "Real-time translation with Livewire for instant results",
      "User-friendly interface built with Alpine JS for smooth interactions",
      "Comprehensive word database with pronunciation and usage examples",
      "Mobile-responsive design for learning on the go",
      "Fast and accurate translations to support cultural preservation",
    ],
  },
  cashflow: {
    logoUrl: "https://cashflow.klinikhappykids.com/img/logocash-tf.png",
    width: "120",
    title: "Catat Duit",
    subtitle: "Personal Finance Manager",
    description:
      "A simple and intuitive cashflow management application designed for personal finance tracking. This tool helps users monitor their income and expenses, set budgets, and gain insights into their spending habits to achieve better financial health.",
    techs: ["Laravel", "jQuery", "Bootstrap 5", "MySQL"],
    link: "https://cashflow.klinikhappykids.com",
    year: "2024",
    role: "Full Stack Developer",
    screenshots: [
      {
        image:
          "https://placehold.co/1200x800/dbeafe/3b82f6?text=Dashboard+Overview",
        title: "Financial Dashboard",
        description:
          "Get a complete overview of your financial situation at a glance. The dashboard displays your current balance, recent transactions, and spending trends in an easy-to-understand format.",
      },
      {
        image:
          "https://placehold.co/1200x800/d1fae5/10b981?text=Income+%26+Expense",
        title: "Income & Expense Tracking",
        description:
          "Easily record your income and expenses with a simple form. Categorize transactions to understand where your money is going and identify areas for improvement.",
      },
      {
        image:
          "https://placehold.co/1200x800/fce7f3/ec4899?text=Charts+%26+Reports",
        title: "Visual Reports & Analytics",
        description:
          "Interactive charts and graphs help visualize your spending patterns over time. Generate detailed reports to analyze your financial habits and make informed decisions.",
      },
    ],
    features: [
      "Easy income and expense tracking with category organization",
      "Visual charts and reports for spending pattern analysis",
      "Budget planning and monitoring with alerts for overspending",
      "Category-based expense organization for better insights",
      "Secure data storage with MySQL ensuring data privacy",
      "Intuitive dashboard with real-time updates on financial status",
    ],
  },
  resto: {
    logoUrl: "https://ptagafood.com/assets/menu/img/Takemori.svg",
    width: "120",
    title: "AgaFood",
    subtitle: "POS for Japanese & Korean Restaurants",
    description:
      "A comprehensive Point of Sales (POS) system designed specifically for Japanese (Takemori) and Korean (Soondobu) restaurants in Banjarmasin, providing a seamless and efficient ordering experience for customers and staff alike.",
    techs: ["Laravel", "Livewire", "Jquery", "Bootstrap", "Alpine JS"],
    link: "https://ptagafood.com/",
    year: "2024",
    role: "Full Stack Developer",
    screenshots: [
      {
        image: "https://placehold.co/1200x800/dbeafe/3b82f6?text=Order+Screen",
        title: "Order Screen",
        description:
          "Effortlessly take orders with a user-friendly interface. The order screen displays menu items, prices, and quantities, allowing staff to quickly and accurately process orders.",
      },
      {
        image: "https://placehold.co/1200x800/d1fae5/10b981?text=Order+History",
        title: "Order History",
        description:
          "Easily view and manage previous orders with the order history feature. Filter orders by date, time, or customer to quickly identify trends and areas for improvement.",
      },
    ],
    features: [
      "Easy-to-use order screen with menu item management",
      "Order history feature for tracking previous orders",
      "Filter orders by date, time, or customer for analysis",
      "Secure data storage with MySQL ensuring data privacy",
      "Intuitive interface for efficient order processing",
    ],
  },
};

// Get current project data
const project = computed(() => {
  return (
    projectsData[projectDetail as keyof typeof projectsData] ||
    projectsData.teory
  );
});
</script>

<style scoped>
/* Inherit styles from parent */
</style>
