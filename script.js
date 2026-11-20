/* ==========================================================================
   script.js – shared site logic
   --------------------------------------------------------------------------
   Requires products.js to be loaded first (it defines the `products` array).

   Pages are identified by <body data-page="home | product | about">.
   - home    : featured products, category filters, search, product grid
   - product : product details page + Buy Now affiliate button
   - about   : only the shared navigation / footer behaviour
   ========================================================================== */

(function () {
  "use strict";

  const SITE_NAME = "PickWise";
  const page = document.body.dataset.page;

  /* ------------------------------------------------------------------------
     Helpers
     ------------------------------------------------------------------------ */

  /** Escape text before inserting it into HTML. */
  function escapeHTML(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /** URL of the details page for a given product. */
  function productURL(id) {
    return "product.html?id=" + encodeURIComponent(id);
  }

  /** Sorted list of unique category names found in the product data. */
  function getCategories() {
    return Array.from(new Set(products.map(function (p) { return p.category; }))).sort();
  }

  /** Only allow real web links for affiliate redirects. */
  function isSafeLink(url) {
    return /^https?:\/\//i.test(url);
  }

  /** Build the HTML for a single product card. */
  function productCardHTML(p) {
    const url = productURL(p.id);
    return (
      '<article class="card">' +
        '<a class="card-image" href="' + url + '" aria-label="View ' + escapeHTML(p.name) + '">' +
          '<img src="' + escapeHTML(p.image) + '" alt="' + escapeHTML(p.name) + '" loading="lazy">' +
        "</a>" +
        '<div class="card-body">' +
          '<span class="tag">' + escapeHTML(p.category) + "</span>" +
          '<h3 class="card-title"><a href="' + url + '">' + escapeHTML(p.name) + "</a></h3>" +
          '<p class="card-desc">' + escapeHTML(p.description) + "</p>" +
          '<div class="card-footer">' +
            '<span class="price">' + escapeHTML(p.price) + "</span>" +
            '<a class="btn btn-outline" href="' + url + '">View Product</a>' +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  /** Render a list of products into a grid element. */
  function renderGrid(container, list) {
    container.innerHTML = list.map(productCardHTML).join("");
  }

  /* ------------------------------------------------------------------------
     Shared: mobile navigation + footer year
     ------------------------------------------------------------------------ */
  function initShared() {
    const toggle = document.getElementById("nav-toggle");
    const nav = document.getElementById("site-nav");

    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        const isOpen = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(isOpen));
      });

      // Close the mobile menu after choosing a link
      nav.addEventListener("click", function (event) {
        if (event.target.closest("a")) {
          nav.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
    }

    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
  }

  /* ------------------------------------------------------------------------
     HOME PAGE
     ------------------------------------------------------------------------ */
  function initHome() {
    const featuredGrid = document.getElementById("featured-grid");
    const productGrid = document.getElementById("product-grid");
    const filterBar = document.getElementById("category-filters");
    const searchInput = document.getElementById("search-input");
    const searchForm = document.getElementById("search-form");
    const resultsCount = document.getElementById("results-count");
    const emptyState = document.getElementById("empty-state");
    const resetButton = document.getElementById("reset-filters");

    const categories = getCategories();

    // Current filter state. Can be pre-set via ?category=...&q=... in the URL
    const params = new URLSearchParams(window.location.search);
    const state = {
      category: categories.indexOf(params.get("category")) !== -1 ? params.get("category") : "All",
      query: (params.get("q") || "").trim()
    };
    searchInput.value = state.query;

    // Featured products
    renderGrid(featuredGrid, products.filter(function (p) { return p.featured; }));

    // Category filter buttons ("All" + one per category)
    function renderFilters() {
      const items = ["All"].concat(categories);
      filterBar.innerHTML = items.map(function (name) {
        const active = name === state.category;
        return '<button type="button" class="chip' + (active ? " active" : "") +
               '" data-category="' + escapeHTML(name) + '" aria-pressed="' + active + '">' +
               escapeHTML(name) + "</button>";
      }).join("");
    }

    // Apply category + search filters and redraw the grid
    function applyFilters() {
      const query = state.query.toLowerCase();

      const results = products.filter(function (p) {
        const matchesCategory = state.category === "All" || p.category === state.category;
        const matchesSearch = p.name.toLowerCase().indexOf(query) !== -1;
        return matchesCategory && matchesSearch;
      });

      renderGrid(productGrid, results);
      emptyState.hidden = results.length > 0;
      productGrid.hidden = results.length === 0;
      resultsCount.textContent =
        "Showing " + results.length + " of " + products.length + " product" + (products.length === 1 ? "" : "s");
    }

    function scrollToProducts() {
      document.getElementById("products").scrollIntoView({ behavior: "smooth" });
    }

    // Events
    filterBar.addEventListener("click", function (event) {
      const chip = event.target.closest(".chip");
      if (!chip) return;
      state.category = chip.dataset.category;
      renderFilters();
      applyFilters();
    });

    searchInput.addEventListener("input", function () {
      state.query = searchInput.value.trim();
      applyFilters();
    });

    searchForm.addEventListener("submit", function (event) {
      event.preventDefault();
      state.query = searchInput.value.trim();
      applyFilters();
      scrollToProducts();
    });

    resetButton.addEventListener("click", function () {
      state.category = "All";
      state.query = "";
      searchInput.value = "";
      renderFilters();
      applyFilters();
    });

    renderFilters();
    applyFilters();
  }

  /* ------------------------------------------------------------------------
     LEAD CAPTURE
     Flow:  product page -> lead form (Tally) -> thank-you.html -> seller
     A per-product flag in localStorage records that the form was submitted.
     NOTE: this is a front-end gate. It is designed to guide visitors, not to
     stop a determined person from finding the seller's link.
     ------------------------------------------------------------------------ */
  const LEAD_KEY = "pickwise_lead_";

  function hasLead(id) {
    try { return localStorage.getItem(LEAD_KEY + id) === "1"; } catch (e) { return false; }
  }

  function setLead(id) {
    try { localStorage.setItem(LEAD_KEY + id, "1"); } catch (e) { /* storage blocked */ }
  }

  function thankYouURL(id) {
    return "thank-you.html?id=" + encodeURIComponent(id);
  }

  /** True while the placeholder form ID has not been replaced. */
  function isDemoMode() {
    return !SITE_CONFIG.tallyFormId || SITE_CONFIG.tallyFormId === "YOUR_TALLY_FORM_ID";
  }

  /** Tally embed URL. product / product_id fill Tally's hidden fields. */
  function tallySrc(product) {
    const q = new URLSearchParams({
      alignLeft: "1",
      hideTitle: "1",
      transparentBackground: "1",
      dynamicHeight: "1",
      product: product.name,
      product_id: product.id
    });
    return "https://tally.so/embed/" + encodeURIComponent(SITE_CONFIG.tallyFormId) + "?" + q.toString();
  }

  /** Built-in demo form (used only until a real Tally ID is set). */
  function demoFormHTML() {
    return (
      '<div class="demo-banner"><strong>Demo mode:</strong> this form does not save any data. ' +
        "Add your Tally form ID in <code>config.js</code> to start capturing leads.</div>" +
      '<form id="demo-form" class="demo-form">' +
        '<label>Full name<input name="name" type="text" required autocomplete="name"></label>' +
        '<label>Email address<input name="email" type="email" required autocomplete="email"></label>' +
        '<label>Phone / WhatsApp<input name="phone" type="tel" autocomplete="tel"></label>' +
        '<label class="check"><input name="consent" type="checkbox" required> ' +
          'I agree to be contacted about this product and accept the <a href="about.html#privacy">privacy notice</a>.</label>' +
        '<button class="btn btn-primary btn-lg" type="submit">Submit &amp; continue</button>' +
      "</form>"
    );
  }

  /** Called once a lead has been submitted for this product. */
  function onLeadSubmitted(product, card) {
    setLead(product.id);
    card.innerHTML =
      '<div class="lead-success" role="status">' +
        '<div class="success-icon">✓</div>' +
        "<h2>Thank you!</h2>" +
        "<p>Your details have been received. Taking you to the buy page…</p>" +
        '<a class="btn btn-primary" href="' + thankYouURL(product.id) + '">Continue now</a>' +
      "</div>";
    window.setTimeout(function () {
      window.location.href = thankYouURL(product.id);
    }, SITE_CONFIG.redirectDelayMs);
  }

  function initLeadForm(product) {
    const section = document.getElementById("lead-section");
    const card = document.getElementById("lead-card");
    const buyButton = document.getElementById("buy-now");
    if (!section || !card) return;

    section.hidden = false;
    card.innerHTML =
      '<div class="lead-head">' +
        '<span class="eyebrow">Step 1 of 2</span>' +
        "<h2>Get started with " + escapeHTML(product.name) + "</h2>" +
        "<p>Tell us where to send your details, then you'll continue to the seller to buy.</p>" +
      "</div>" +
      '<div id="lead-form-area"></div>';

    const area = document.getElementById("lead-form-area");

    if (isDemoMode()) {
      area.innerHTML = demoFormHTML();
      document.getElementById("demo-form").addEventListener("submit", function (event) {
        event.preventDefault();
        onLeadSubmitted(product, card);
      });
    } else {
      // Real Tally embed
      area.innerHTML =
        '<iframe id="tally-frame" data-tally-src="' + escapeHTML(tallySrc(product)) + '" ' +
        'width="100%" height="420" frameborder="0" marginheight="0" marginwidth="0" ' +
        'title="Lead form for ' + escapeHTML(product.name) + '"></iframe>';

      const frame = document.getElementById("tally-frame");
      const useFallback = function () { frame.src = frame.dataset.tallySrc; };
      const script = document.createElement("script");
      script.src = "https://tally.so/widgets/embed.js";
      script.onload = function () {
        if (window.Tally && typeof window.Tally.loadEmbeds === "function") window.Tally.loadEmbeds();
        else useFallback();
      };
      script.onerror = useFallback;
      document.body.appendChild(script);

      // Tally announces a completed submission with a postMessage event
      window.addEventListener("message", function (event) {
        if (event.origin !== "https://tally.so") return;
        if (typeof event.data === "string" && event.data.indexOf("Tally.FormSubmitted") !== -1) {
          onLeadSubmitted(product, card);
        }
      });
    }

    // Buy Now: returning visitors who already submitted skip the form
    buyButton.addEventListener("click", function () {
      if (hasLead(product.id)) {
        window.location.href = thankYouURL(product.id);
      } else {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
        section.classList.add("pulse");
        window.setTimeout(function () { section.classList.remove("pulse"); }, 1500);
      }
    });
  }

  /* ------------------------------------------------------------------------
     THANK-YOU / BUY PAGE  (thank-you.html?id=N)
     Only shown after the lead form was submitted for that product.
     The Buy Now button here uses the product's own affiliateLink.
     ------------------------------------------------------------------------ */
  function initThankYou() {
    const box = document.getElementById("thanks-box");
    const id = Number(new URLSearchParams(window.location.search).get("id"));
    const product = products.find(function (p) { return p.id === id; });

    if (!product) {
      box.innerHTML =
        "<h1>Product not found</h1>" +
        '<a class="btn btn-primary" href="index.html#products">Browse all products</a>';
      return;
    }

    // Visitors who skipped the form are sent back to it
    if (!hasLead(product.id)) {
      window.location.replace(productURL(product.id) + "#lead-section");
      return;
    }

    document.title = "Thank you | " + SITE_NAME;
    const safe = isSafeLink(product.affiliateLink);

    box.innerHTML =
      '<div class="success-icon">✓</div>' +
      "<h1>Thank you!</h1>" +
      "<p>Your details have been received. You're all set to continue to the seller.</p>" +
      '<div class="thanks-product">' +
        '<img src="' + escapeHTML(product.image) + '" alt="">' +
        "<div><strong>" + escapeHTML(product.name) + "</strong><br>" +
        '<span class="price">' + escapeHTML(product.price) + "</span></div>" +
      "</div>" +
      (safe
        ? '<a id="buy-now" class="btn btn-primary btn-lg" href="' + escapeHTML(product.affiliateLink) + '" ' +
          'target="_blank" rel="sponsored nofollow noopener noreferrer">Buy Now on the seller\'s website</a>'
        : '<span class="btn btn-lg" aria-disabled="true">Link unavailable</span>') +
      '<p class="buy-note">You will leave PickWise to complete your purchase. We may earn a commission at no extra cost to you. ' +
        '<a href="about.html#disclosure">Affiliate disclosure</a></p>' +
      '<p><a href="' + productURL(product.id) + '">&larr; Back to product</a></p>';
  }

  /* ------------------------------------------------------------------------
     PRODUCT DETAILS PAGE
     Reads ?id=NUMBER from the URL and shows that product.
     Buy Now leads to the lead form; the affiliate link is only used on
     thank-you.html after the form is submitted.
     ------------------------------------------------------------------------ */
  function initProduct() {
    const container = document.getElementById("product-detail");
    const relatedSection = document.getElementById("related-section");
    const relatedGrid = document.getElementById("related-grid");

    const id = Number(new URLSearchParams(window.location.search).get("id"));
    const product = products.find(function (p) { return p.id === id; });

    // Unknown / missing product id
    if (!product) {
      document.title = "Product not found | " + SITE_NAME;
      container.className = "";
      container.innerHTML =
        '<div class="not-found">' +
          "<h1>Product not found</h1>" +
          "<p>Sorry, we couldn't find that product.</p>" +
          '<a class="btn btn-primary" href="index.html#products">Browse all products</a>' +
        "</div>";
      return;
    }

    document.title = product.name + " | " + SITE_NAME;

    const features = (product.features || []).map(function (f) {
      return "<li>" + escapeHTML(f) + "</li>";
    }).join("");

    container.innerHTML =
      '<div class="detail-image">' +
        '<img src="' + escapeHTML(product.image) + '" alt="' + escapeHTML(product.name) + '">' +
      "</div>" +
      '<div class="detail-info">' +
        '<a class="tag" href="index.html?category=' + encodeURIComponent(product.category) + '#products">' +
          escapeHTML(product.category) +
        "</a>" +
        "<h1>" + escapeHTML(product.name) + "</h1>" +
        '<div class="detail-price">' + escapeHTML(product.price) + "</div>" +
        '<p class="detail-desc">' + escapeHTML(product.longDescription || product.description) + "</p>" +
        "<h3>Key features</h3>" +
        '<ul class="feature-list">' + features + "</ul>" +
        '<div class="buy-box">' +
          // Buy Now does NOT go to the seller directly. It sends the visitor
          // to the lead form first (see initLeadForm below).
          '<button type="button" id="buy-now" class="btn btn-primary btn-lg">Buy Now</button>' +
          '<p class="buy-note">Quick step first: enter your details below, then you\'ll continue to the seller\'s website. ' +
            'We may earn a commission at no extra cost to you. ' +
            '<a href="about.html#disclosure">Affiliate disclosure</a></p>' +
        "</div>" +
      "</div>";

    initLeadForm(product);

    // Related products (same category first, then others)
    const related = products
      .filter(function (p) { return p.id !== product.id; })
      .sort(function (a, b) {
        return (b.category === product.category) - (a.category === product.category);
      })
      .slice(0, 4);

    if (related.length) {
      renderGrid(relatedGrid, related);
      relatedSection.hidden = false;
    }
  }

  /* ------------------------------------------------------------------------
     Start
     ------------------------------------------------------------------------ */
  initShared();
  if (page === "home") initHome();
  if (page === "product") initProduct();
  if (page === "thankyou") initThankYou();
})();
