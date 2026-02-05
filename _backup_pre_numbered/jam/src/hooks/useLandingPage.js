/**
 * 🎯 useLandingPage Hook
 * =======================
 * Hook for landing page builder integration
 *
 * Features:
 * - Template management
 * - Page creation/editing
 * - Form handling
 * - Webhook integration
 * - Analytics
 */

import { useState, useCallback } from "react";

/**
 * Landing Page Templates
 */
export const Templates = {
  BLANK: "blank",
  SALES: "sales",
  WEBINAR: "webinar",
  EBOOK: "ebook",
  WAITLIST: "waitlist",
  COURSE: "course",
};

/**
 * Default template configurations
 */
const TEMPLATE_CONFIGS = {
  [Templates.BLANK]: {
    name: "Blank",
    icon: "📄",
    sections: ["header"],
  },
  [Templates.SALES]: {
    name: "Sales Page",
    icon: "💰",
    sections: [
      "hero",
      "benefits",
      "testimonials",
      "pricing",
      "cta",
      "faq",
      "footer",
    ],
  },
  [Templates.WEBINAR]: {
    name: "Webinar",
    icon: "🎥",
    sections: [
      "countdown",
      "video",
      "presenter",
      "agenda",
      "registration",
      "footer",
    ],
  },
  [Templates.EBOOK]: {
    name: "E-book",
    icon: "📚",
    sections: ["hero", "preview", "chapters", "author", "download", "footer"],
  },
  [Templates.WAITLIST]: {
    name: "Waitlist",
    icon: "📝",
    sections: ["hero", "form", "counter", "footer"],
  },
  [Templates.COURSE]: {
    name: "Course",
    icon: "🎓",
    sections: [
      "hero",
      "curriculum",
      "instructor",
      "testimonials",
      "pricing",
      "faq",
      "footer",
    ],
  },
};

/**
 * useLandingPage Hook
 */
export function useLandingPage() {
  const [currentPage, setCurrentPage] = useState(null);
  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Create a new landing page
   */
  const createPage = useCallback(
    async (template = Templates.BLANK, options = {}) => {
      setIsLoading(true);
      setError(null);

      try {
        const templateConfig = TEMPLATE_CONFIGS[template];
        if (!templateConfig) {
          console.error(`Unknown template: ${template}`);
          setError(`Unknown template: ${template}`);
          setIsLoading(false);
          return {
            success: false,
            error: `Unknown template: ${template}`,
            isolated: true,
          };
        }

        const page = {
          id: `lp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          template,
          name: options.name || `New ${templateConfig.name}`,
          slug: options.slug || `page-${Date.now()}`,
          sections: templateConfig.sections.map((sectionType) => ({
            id: `section_${Math.random().toString(36).slice(2, 8)}`,
            type: sectionType,
            content: getDefaultContent(sectionType),
            styles: {},
          })),
          settings: {
            title: options.title || templateConfig.name,
            description: options.description || "",
            favicon: options.favicon || "🐼",
            ogImage: options.ogImage || null,
            analytics: {
              googleAnalytics: null,
              facebookPixel: null,
            },
            webhook: {
              url: null,
              secret: null,
            },
          },
          createdAt: Date.now(),
          updatedAt: Date.now(),
          published: false,
          publishedUrl: null,
        };

        // Save to Panda Data
        if (window.Panda?.Data?.save) {
          await window.Panda.Data.save("landing_pages", page);
        }

        setCurrentPage(page);
        setPages((prev) => [...prev, page]);

        return { success: true, page };
      } catch (err) {
        setError(err.message);
        return { success: false, error: err.message };
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  /**
   * Load a landing page
   */
  const loadPage = useCallback(async (pageId) => {
    setIsLoading(true);
    setError(null);

    try {
      let page = null;

      if (window.Panda?.Data?.get) {
        page = await window.Panda.Data.get("landing_pages", pageId);
      }

      if (!page) {
        console.error(`Page not found: ${pageId}`);
        setError(`Page not found: ${pageId}`);
        setIsLoading(false);
        return {
          success: false,
          error: `Page not found: ${pageId}`,
          isolated: true,
        };
      }

      setCurrentPage(page);
      return { success: true, page };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Save current page
   */
  const savePage = useCallback(async () => {
    if (!currentPage) {
      return { success: false, error: "No page loaded" };
    }

    setIsLoading(true);

    try {
      const updated = {
        ...currentPage,
        updatedAt: Date.now(),
      };

      if (window.Panda?.Data?.save) {
        await window.Panda.Data.save("landing_pages", updated);
      }

      setCurrentPage(updated);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  /**
   * Update a section
   */
  const updateSection = useCallback(
    (sectionId, updates) => {
      if (!currentPage) return;

      setCurrentPage((prev) => ({
        ...prev,
        sections: prev.sections.map((section) =>
          section.id === sectionId ? { ...section, ...updates } : section,
        ),
        updatedAt: Date.now(),
      }));
    },
    [currentPage],
  );

  /**
   * Add a section
   */
  const addSection = useCallback(
    (type, afterSectionId = null) => {
      if (!currentPage) return;

      const newSection = {
        id: `section_${Math.random().toString(36).slice(2, 8)}`,
        type,
        content: getDefaultContent(type),
        styles: {},
      };

      setCurrentPage((prev) => {
        const sections = [...prev.sections];
        if (afterSectionId) {
          const index = sections.findIndex((s) => s.id === afterSectionId);
          sections.splice(index + 1, 0, newSection);
        } else {
          sections.push(newSection);
        }
        return { ...prev, sections, updatedAt: Date.now() };
      });
    },
    [currentPage],
  );

  /**
   * Remove a section
   */
  const removeSection = useCallback(
    (sectionId) => {
      if (!currentPage) return;

      setCurrentPage((prev) => ({
        ...prev,
        sections: prev.sections.filter((s) => s.id !== sectionId),
        updatedAt: Date.now(),
      }));
    },
    [currentPage],
  );

  /**
   * Publish page
   */
  const publishPage = useCallback(async () => {
    if (!currentPage) {
      return { success: false, error: "No page loaded" };
    }

    setIsLoading(true);

    try {
      // Generate published URL (in production: deploy to hosting)
      const publishedUrl = `https://panda.factory/lp/${currentPage.slug}`;

      const updated = {
        ...currentPage,
        published: true,
        publishedUrl,
        publishedAt: Date.now(),
        updatedAt: Date.now(),
      };

      if (window.Panda?.Data?.save) {
        await window.Panda.Data.save("landing_pages", updated);
      }

      setCurrentPage(updated);

      return { success: true, url: publishedUrl };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  /**
   * Configure webhook for form submissions
   */
  const configureWebhook = useCallback(
    (url, secret = null) => {
      if (!currentPage) return;

      setCurrentPage((prev) => ({
        ...prev,
        settings: {
          ...prev.settings,
          webhook: { url, secret },
        },
        updatedAt: Date.now(),
      }));
    },
    [currentPage],
  );

  /**
   * Get page analytics
   */
  const getAnalytics = useCallback(async (pageId, period = "30d") => {
    // Mock analytics (in production: fetch from analytics service)
    return {
      pageId,
      period,
      views: 1250,
      uniqueVisitors: 890,
      conversions: 45,
      conversionRate: 5.06,
      formSubmissions: 67,
      avgTimeOnPage: 124, // seconds
    };
  }, []);

  /**
   * List all pages
   */
  const listPages = useCallback(async () => {
    setIsLoading(true);

    try {
      let results = [];

      if (window.Panda?.Data?.list) {
        results = await window.Panda.Data.list("landing_pages", {
          orderBy: [["updatedAt", "desc"]],
        });
      }

      setPages(results || []);
      return results;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    // State
    currentPage,
    pages,
    isLoading,
    error,
    templates: TEMPLATE_CONFIGS,

    // Methods
    createPage,
    loadPage,
    savePage,
    publishPage,
    listPages,

    // Section editing
    updateSection,
    addSection,
    removeSection,

    // Configuration
    configureWebhook,

    // Analytics
    getAnalytics,

    // Utils
    clearError: () => setError(null),
  };
}

/**
 * Get default content for a section type
 */
function getDefaultContent(type) {
  const defaults = {
    header: { title: "", logo: "🐼", nav: [] },
    hero: {
      headline: "Headline Here",
      subheadline: "Subheadline",
      cta: "Get Started",
      image: null,
    },
    benefits: { items: [] },
    testimonials: { items: [] },
    pricing: { plans: [] },
    cta: { headline: "Ready to Start?", button: "Get Started Now" },
    faq: { items: [] },
    footer: { text: "© 2026 Panda Factory", links: [] },
    countdown: { date: null, title: "Starting Soon" },
    video: { url: null, thumbnail: null },
    presenter: { name: "", title: "", bio: "", photo: null },
    agenda: { items: [] },
    registration: { fields: ["name", "email"], button: "Register Now" },
    preview: { images: [], description: "" },
    chapters: { items: [] },
    author: { name: "", bio: "", photo: null },
    download: { button: "Download Now", file: null },
    form: { fields: ["name", "email"], button: "Submit" },
    counter: { current: 0, goal: 1000 },
    curriculum: { modules: [] },
    instructor: { name: "", bio: "", photo: null },
  };

  return defaults[type] || {};
}

export default useLandingPage;
