/**
 * Garage & Storage Organization Service - Main JavaScript
 * Handles Theme Toggling (Dark/Light), Direction (RTL/LTR),
 * Gallery Lightbox & Filtering, Blog Search & Filter, Dynamic Service Details, and Form Validations.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initDirection();
  initGallery();
  initBlog();
  initBlogDetails();
  initServiceDetails();
  initContactForm();
  initNewsletter();
});

/* ==========================================================================
   1. THEME TOGGLE (DARK / LIGHT MODE)
   ========================================================================== */
function initTheme() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const currentTheme = localStorage.getItem('garage_theme') || 'light';

  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcons(currentTheme);

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const activeTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('garage_theme', newTheme);
      updateThemeIcons(newTheme);
    });
  });
}

function updateThemeIcons(theme) {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  themeToggleBtns.forEach(btn => {
    const icon = btn.querySelector('i');
    if (icon) {
      if (theme === 'dark') {
        icon.className = 'fas fa-sun';
        btn.setAttribute('title', 'Switch to Light Mode');
        btn.setAttribute('aria-label', 'Switch to Light Mode');
      } else {
        icon.className = 'fas fa-moon';
        btn.setAttribute('title', 'Switch to Dark Mode');
        btn.setAttribute('aria-label', 'Switch to Dark Mode');
      }
    }
  });
}

/* ==========================================================================
   2. RTL / LTR DIRECTION TOGGLE
   ========================================================================== */
function initDirection() {
  const rtlToggleBtns = document.querySelectorAll('.rtl-toggle-btn');
  const currentDir = localStorage.getItem('garage_dir') || 'ltr';

  document.documentElement.setAttribute('dir', currentDir);
  updateRTLButtons(currentDir);

  rtlToggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const activeDir = document.documentElement.getAttribute('dir');
      const newDir = activeDir === 'rtl' ? 'ltr' : 'rtl';
      
      document.documentElement.setAttribute('dir', newDir);
      localStorage.setItem('garage_dir', newDir);
      updateRTLButtons(newDir);
    });
  });
}

function updateRTLButtons(dir) {
  const rtlToggleBtns = document.querySelectorAll('.rtl-toggle-btn');
  rtlToggleBtns.forEach(btn => {
    if (dir === 'rtl') {
      btn.innerHTML = '<span class="fw-bold" style="font-size:0.8rem">LTR</span>';
      btn.setAttribute('title', 'Switch to Left-to-Right');
    } else {
      btn.innerHTML = '<span class="fw-bold" style="font-size:0.8rem">RTL</span>';
      btn.setAttribute('title', 'Switch to Right-to-Left');
    }
  });

  const telInputs = document.querySelectorAll('input[type="tel"]');
  telInputs.forEach(input => {
    input.setAttribute('dir', dir);
  });
}

/* ==========================================================================
   3. GALLERY FILTERING & LIGHTBOX MODAL
   ========================================================================== */
function initGallery() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('galleryLightbox');
  
  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        galleryItems.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filterValue === 'all' || category === filterValue) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // Lightbox functionality
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    let currentImages = [];
    let currentIndex = 0;

    function openLightbox(index) {
      currentImages = Array.from(document.querySelectorAll('.gallery-item'))
        .filter(item => item.style.display !== 'none');
      
      if (currentImages.length === 0) return;
      
      currentIndex = index;
      const targetItem = currentImages[currentIndex];
      const img = targetItem.querySelector('img');
      const title = targetItem.querySelector('.gallery-item-title')?.textContent || '';
      const cat = targetItem.querySelector('.gallery-item-cat')?.textContent || '';

      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = title ? `${title} (${cat})` : img.alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    function showNext() {
      if (currentImages.length <= 1) return;
      currentIndex = (currentIndex + 1) % currentImages.length;
      openLightbox(currentIndex);
    }

    function showPrev() {
      if (currentImages.length <= 1) return;
      currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
      openLightbox(currentIndex);
    }

    galleryItems.forEach((item, idx) => {
      item.addEventListener('click', () => {
        const visibleIndex = Array.from(document.querySelectorAll('.gallery-item'))
          .filter(el => el.style.display !== 'none')
          .indexOf(item);
        openLightbox(visibleIndex >= 0 ? visibleIndex : 0);
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (nextBtn) nextBtn.addEventListener('click', showNext);
    if (prevBtn) prevBtn.addEventListener('click', showPrev);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    });
  }
}

/* ==========================================================================
   4. BLOG DATABASE & DYNAMIC BLOG DETAILS
   ========================================================================== */
const blogDatabase = {
  'shelving-rules': {
    id: 'shelving-rules',
    aliases: ['shelving', 'shelving-rules', 'shelving-placement', '10-essential-rules-for-garage-shelving-placement'],
    title: '10 Essential Rules for Garage Shelving Placement',
    category: 'shelving',
    categoryName: 'Garage Shelving',
    date: 'October 2026',
    readTime: '5 min read',
    author: 'Space Planning Engineering Team',
    summary: 'Learn how to calculate wall stud spacing, avoid car door swing arcs, and maximize vertical storage capacity.',
    mainImg: 'assets/images/blog-1.jpg',
    keywords: ['shelving', 'rules', 'studs', 'brackets', 'doors', 'clearance', 'zones', 'totes', 'wall storage', 'steel shelving', 'weight limits', 'placement'],
    relatedIds: ['single-car-garage', 'slatwall-vs-pegboard', 'ceiling-storage-safety'],
    content: `
      <p class="lead">
        Installing garage shelving isn’t simply a matter of buying brackets and screwing them into the nearest drywall. To create a system that withstands heavy storage bins and permits effortless vehicle parking, you must follow clear structural and spatial guidelines.
      </p>

      <h2>1. Always Anchor Directly Into Structural Studs</h2>
      <p>
        Drywall anchors—even heavy toggle bolts—are inadequate for garage storage. A single 27-gallon tote full of tools or hardware can easily weigh 75 lbs. Across a 4-foot shelf holding four totes, that’s 300 lbs of deadweight pulling against your fasteners. Use a precision stud finder and drive minimum 3-inch, grade-5 structural lag screws into the center of wood studs or specialized metal stud anchors.
      </p>

      <h2>2. Calculate Vehicle Door Swing Arcs First</h2>
      <p>
        The most common error in DIY garage organization is placing 24-inch deep shelving along the side walls right where car doors open. Before mounting any rail:
      </p>
      <ul>
        <li>Park your largest vehicle inside the bay in its normal parking position.</li>
        <li>Open all passenger and driver doors to their first and second detents.</li>
        <li>Maintain a minimum of 4 inches of clearance between the open door edge and the shelf face.</li>
        <li>Use 12-inch or 16-inch shallow shelving near doors, and save 24-inch deep units for the back wall.</li>
      </ul>

      <div class="article-featured-quote">
        "A truly functional garage allows you to park your vehicle inside every evening and open your car doors completely without ever touching a storage shelf."
      </div>

      <h2>3. Observe Vertical Zoning Principles</h2>
      <p>
        Divide your garage wall into three distinct vertical zones based on usage frequency and weight:
      </p>
      <ol>
        <li><strong>Lower Zone (0 to 30 inches):</strong> Heavy bins, bulky coolers, pressure washers, and floor leveling storage.</li>
        <li><strong>Prime Zone (30 to 72 inches):</strong> Hand tools, daily sports equipment, hardware, and frequently accessed items at eye level.</li>
        <li><strong>Upper Zone (72 inches & above):</strong> Lightweight holiday decor, seasonal camping gear, and archive storage.</li>
      </ol>

      <h2>4. Plan for Standard Tote Geometry</h2>
      <p>
        Don’t install shelves with arbitrary vertical spacing. Standard heavy-duty plastic storage totes have heights of 14.5 to 17 inches. Setting your vertical shelf intervals at 18 to 20 inches ensures bins slide in and out smoothly without catching on the shelf above.
      </p>

      <h2>5. Maintain Clear Access to Utility Controls</h2>
      <p>
        Never build shelving across your electrical breaker panel, main water shutoff valve, or gas meters. Building codes typically require a minimum 36-inch clear radius in front of electrical service panels.
      </p>

      <h2>6. Distribute Load Evenly Across Bracket Arms</h2>
      <p>
        Always place the densest items closest to the wall uprights. Placing excessive weight at the outer edge of a 20-inch shelf increases rotational torque on the stud fasteners by over 300%.
      </p>

      <!-- Practical Checklist Box -->
      <div class="p-4 rounded border my-4" style="background-color: var(--bg-surface); border-color: var(--border-color);">
        <h4 class="mb-3"><i class="fas fa-clipboard-check me-2" style="color:var(--text-heading)"></i> Pre-Installation Checklist</h4>
        <ul class="list-unstyled mb-0">
          <li class="d-flex align-items-center gap-2 mb-2"><i class="fas fa-check text-muted"></i> Stud centers mapped and marked with laser line</li>
          <li class="d-flex align-items-center gap-2 mb-2"><i class="fas fa-check text-muted"></i> Car parking position and door arcs verified</li>
          <li class="d-flex align-items-center gap-2 mb-2"><i class="fas fa-check text-muted"></i> Breaker panel and water shutoff clearances verified</li>
          <li class="d-flex align-items-center gap-2 mb-2"><i class="fas fa-check text-muted"></i> Heavy-gauge grade-5 lag bolts ready for structural anchoring</li>
        </ul>
      </div>

      <!-- Article Footer CTA -->
      <div class="p-4 p-md-5 rounded border mt-5 text-center" style="background-color: var(--bg-surface); border-color: var(--border-color); border-radius: var(--radius-lg);">
        <h3 class="mb-2">Need a Professional Space Plan?</h3>
        <p class="text-muted mb-4">Our garage specialists measure your walls, map vehicle clearances, and install custom heavy-duty shelving tailored to your home.</p>
        <a href="contact.html" class="btn btn-primary btn-lg">
          <i class="fas fa-calendar-check me-2"></i> Book Free Consultation
        </a>
      </div>
    `
  },

  'single-car-garage': {
    id: 'single-car-garage',
    aliases: ['single-car', 'single-car-garage', 'single-car-bay', 'maximize-vertical-space', 'how-to-maximize-vertical-space-in-a-single-car-garage'],
    title: 'How to Maximize Vertical Space in a Single-Car Garage',
    category: 'decluttering',
    categoryName: 'Decluttering Tips',
    date: 'September 2026',
    readTime: '4 min read',
    author: 'Residential Organization Specialist',
    summary: 'Smart strategies for tight single-car bays to store bicycles, bins, and ladders without blocking the driveway entrance.',
    mainImg: 'assets/images/blog-2.jpg',
    keywords: ['single-car', 'single car', 'single car bay', 'vertical space', 'small garage', 'tight garage', 'bicycles', 'ladders', 'fold-down', 'clearance', 'decluttering'],
    relatedIds: ['shelving-rules', 'slatwall-vs-pegboard', 'garage-declutter-psychology'],
    content: `
      <p class="lead">
        Single-car garages present unique architectural challenges. With standard dimensions averaging just 10 to 12 feet wide, standard floor shelving often makes opening car doors impossible. Maximizing vertical wall real estate is the only way to retain parking while storing household essentials.
      </p>

      <h2>1. Map Out the Footprint: The 36-Inch Rule for Vehicle Egress</h2>
      <p>
        Before purchasing storage systems, park your car in its exact daily position. Measure the distance from the driver door edge to the wall when opened to a comfortable entering width. If you have less than 36 inches, standard floor-standing cabinets are out of the question—you need ultra-shallow wall systems (under 12 inches) or overhead solutions.
      </p>

      <h2>2. Install Full-Height Continuous Wall Tracks</h2>
      <p>
        Vertical wall tracks with modular cantilever brackets allow you to use the top 4 feet of your wall (above head height) for bulky seasonal items, leaving the lower wall completely clear for door swings and bicycle parking.
      </p>

      <div class="article-featured-quote">
        "In a single-car garage, every square foot of floor is parking space. If an item doesn't roll or park, it belongs on the wall or ceiling."
      </div>

      <h2>3. Use Swivel-Mount Bike Hangers</h2>
      <p>
        Bicycles parked on kickstands consume up to 15 square feet of prime floor space each. Swivel-mount vertical bike racks allow you to hang bikes by the front wheel and pivot them flat against the drywall, reducing the footprint to under 12 inches of wall projection.
      </p>

      <h2>4. Leverage the Dead Space Above the Hood</h2>
      <p>
        The area directly above the hood of a parked vehicle is usually empty air. Installing a 24-inch deep wall-mounted shelf or overhead platform at 5 feet height above the hood provides immense storage for totes without impeding the car's engine bay clearance.
      </p>

      <h2>5. Deploy Fold-Down Workbenches</h2>
      <p>
        If you need a workspace for home repairs, a fixed workbench consumes permanent floor area. Heavy-duty wall-mounted folding brackets allow a 48-inch hardwood worktop to fold flat against the wall when not in use, creating instant workshop capability that vanishes when you park.
      </p>

      <!-- Practical Checklist Box -->
      <div class="p-4 rounded border my-4" style="background-color: var(--bg-surface); border-color: var(--border-color);">
        <h4 class="mb-3"><i class="fas fa-clipboard-check me-2" style="color:var(--text-heading)"></i> Single-Car Optimization Checklist</h4>
        <ul class="list-unstyled mb-0">
          <li class="d-flex align-items-center gap-2 mb-2"><i class="fas fa-check text-muted"></i> 36-inch driver door egress path cleared and verified</li>
          <li class="d-flex align-items-center gap-2 mb-2"><i class="fas fa-check text-muted"></i> Swivel bike mounts installed to eliminate floor clutter</li>
          <li class="d-flex align-items-center gap-2 mb-2"><i class="fas fa-check text-muted"></i> High-wall shelves mounted above car hood zone</li>
          <li class="d-flex align-items-center gap-2 mb-2"><i class="fas fa-check text-muted"></i> Folding workbench installed for multi-purpose utility</li>
        </ul>
      </div>

      <!-- Article Footer CTA -->
      <div class="p-4 p-md-5 rounded border mt-5 text-center" style="background-color: var(--bg-surface); border-color: var(--border-color); border-radius: var(--radius-lg);">
        <h3 class="mb-2">Need Help Maximizing a Small Garage?</h3>
        <p class="text-muted mb-4">Our space planners specialize in tight single-car bays. Schedule a design review to see custom vertical storage layout renderings.</p>
        <a href="contact.html" class="btn btn-primary btn-lg">
          <i class="fas fa-calendar-check me-2"></i> Book Free Consultation
        </a>
      </div>
    `
  },

  'slatwall-vs-pegboard': {
    id: 'slatwall-vs-pegboard',
    aliases: ['slatwall', 'slatwall-vs-pegboard', 'slatwall-pegboard', 'tools', 'tool-storage'],
    title: 'Slatwall vs. Pegboard: The Definitive Comparison',
    category: 'tools',
    categoryName: 'Tool Organization',
    date: 'September 2026',
    readTime: '6 min read',
    author: 'Hardware & Material Testing Lab',
    summary: 'An engineering analysis comparing weight capacity, moisture resistance, locking hooks, and long-term durability.',
    mainImg: 'assets/images/blog-3.jpg',
    keywords: ['slatwall', 'pegboard', 'tools', 'hooks', 'comparison', 'pvc slatwall', 'masonite', 'weight capacity', 'durability', 'tool organization', 'cam-lok'],
    relatedIds: ['shelving-rules', 'single-car-garage', 'ceiling-storage-safety'],
    content: `
      <p class="lead">
        When organizing hand tools, power equipment, garden hoses, and ladders, homeowners generally compare two major wall systems: traditional pegboard and modern cellular PVC slatwall. Here is an engineering and practical breakdown of how they perform in real garage conditions.
      </p>

      <h2>1. Structural Weight Capacity and Load Distribution</h2>
      <p>
        Standard 1/4-inch perforated hardboard pegboard supports roughly 10 to 15 lbs per hook before hole deformation occurs. In contrast, heavy-duty cellular PVC slatwall panels are screw-fastened directly to wall studs across multiple horizontal channels, supporting up to 75 lbs per square foot. Heavy tools like weed trimmers, sledgehammers, and extension ladders require the structural rigidity of slatwall.
      </p>

      <h2>2. Garage Humidity, Temperature Swings, and Moisture</h2>
      <p>
        Garages experience intense temperature shifts and seasonal humidity. Traditional masonite or pressboard pegboard absorbs airborne moisture, leading to swelling, warping, and crumbling around hook perforations within 2 to 3 years. Cellular PVC and aluminum slatwall systems are 100% waterproof, impervious to mold, and easily cleaned with a garden hose.
      </p>

      <div class="article-featured-quote">
        "Standard masonite pegboard deteriorates under seasonal garage humidity, while cellular PVC slatwall provides lifetime structural rigidity and modular flexibility."
      </div>

      <h2>3. Hook Security and the "Falling Hook" Problem</h2>
      <p>
        Anyone who has used traditional pegboard knows the frustration of lifting a wrench or hammer and having the metal hook pull out of the wall and clatter to the floor. Modern slatwall systems incorporate proprietary locking mechanisms (such as Cam-Lok clips or set screws) that lock accessories into the horizontal groove until manually released.
      </p>

      <h2>4. Aesthetic Cleanliness and Finish Options</h2>
      <p>
        Slatwall panels conceal drywall imperfections and provide a clean, architectural finish available in matte black, slate gray, and bright white. Hidden screw tracks ensure a sleek fastener-free exterior that transforms raw garage walls into a showroom backdrop.
      </p>

      <!-- Practical Comparison Box -->
      <div class="p-4 rounded border my-4" style="background-color: var(--bg-surface); border-color: var(--border-color);">
        <h4 class="mb-3"><i class="fas fa-table-list me-2" style="color:var(--text-heading)"></i> Quick Engineering Comparison</h4>
        <ul class="list-unstyled mb-0">
          <li class="d-flex align-items-center gap-2 mb-2"><i class="fas fa-check text-muted"></i> <strong>Weight Capacity:</strong> Slatwall (75 lbs/sq ft) vs. Pegboard (15 lbs/hook)</li>
          <li class="d-flex align-items-center gap-2 mb-2"><i class="fas fa-check text-muted"></i> <strong>Moisture Resistance:</strong> Slatwall (100% Waterproof PVC) vs. Pegboard (Vulnerable to Humidity)</li>
          <li class="d-flex align-items-center gap-2 mb-2"><i class="fas fa-check text-muted"></i> <strong>Hook Locking:</strong> Slatwall (Integrated Cam-Lok) vs. Pegboard (Loose Friction Fit)</li>
          <li class="d-flex align-items-center gap-2 mb-2"><i class="fas fa-check text-muted"></i> <strong>Expected Lifespan:</strong> Slatwall (20+ Years Lifetime) vs. Pegboard (3–5 Years)</li>
        </ul>
      </div>

      <!-- Article Footer CTA -->
      <div class="p-4 p-md-5 rounded border mt-5 text-center" style="background-color: var(--bg-surface); border-color: var(--border-color); border-radius: var(--radius-lg);">
        <h3 class="mb-2">Ready to Upgrade to Professional Slatwall?</h3>
        <p class="text-muted mb-4">We supply and install heavy-duty PVC slatwall panels with over 40 locking hook and basket accessories tailored for your tool collection.</p>
        <a href="contact.html" class="btn btn-primary btn-lg">
          <i class="fas fa-calendar-check me-2"></i> Request Slatwall Estimate
        </a>
      </div>
    `
  },

  'ceiling-storage-safety': {
    id: 'ceiling-storage-safety',
    aliases: ['ceiling', 'ceiling-storage-safety', 'ceiling-safety', 'overhead', 'overhead-storage', 'safe-ceiling-storage'],
    title: 'Safe Ceiling Storage: Weight Limits & Anchoring Tips',
    category: 'overhead',
    categoryName: 'Overhead Storage',
    date: 'August 2026',
    readTime: '7 min read',
    author: 'Structural Installation Specialist',
    summary: 'A deep dive into ceiling joist spans, structural lag bolts, distributed loads, and vehicle clearance safety.',
    mainImg: 'assets/images/blog-4.jpg',
    keywords: ['ceiling', 'overhead', 'overhead storage', 'weight limits', 'joists', 'lag bolts', 'safety', 'anchoring', 'trusses', 'clearance', 'racks'],
    relatedIds: ['shelving-rules', 'seasonal-storage-rotation', 'single-car-garage'],
    content: `
      <p class="lead">
        Ceiling storage racks unlock hundreds of cubic feet of previously unused air space directly above your vehicles and garage door tracks. However, suspending hundreds of pounds above valuable cars and walking paths requires strict adherence to structural engineering best practices.
      </p>

      <h2>1. Identifying Joist Framing: Trusses vs. Solid Timber</h2>
      <p>
        Before installing any overhead rack, verify your garage ceiling construction. Engineered roof trusses (2x4 bottom chords) have different load characteristics than 2x6, 2x8, or 2x10 ceiling floor joists. Racks should always span across multiple ceiling joists using heavy-gauge ceiling angle brackets, never loading a single chord point.
      </p>

      <h2>2. Structural Fastener Standards: 5/16" Grade-5 Lag Bolts</h2>
      <p>
        Standard drywall screws or deck screws must NEVER be used for overhead storage. Proper installation requires 5/16-inch by 3-inch heat-treated steel lag bolts driven into pre-drilled pilot holes centered in the solid structural framing lumber.
      </p>

      <div class="article-featured-quote">
        "Ceiling storage is the ultimate dead-space solution, but safety requires rigorous adherence to structural framing attachments and distributed load ratings."
      </div>

      <h2>3. Understanding Distributed Weight Limits (400 to 600 lbs)</h2>
      <p>
        A 4x8-foot overhead rack is typically rated for 500 to 600 lbs of evenly distributed static load. This rating assumes the weight is spread across the entire wire decking. Never place a single 300-lb object in the center of the grid, as point-loading can cause localized deck deflection and fatigue.
      </p>

      <h2>4. Garage Door Track and Vehicle Clearance</h2>
      <p>
        Calculate the full path of your motorized garage door. The lowest edge of the ceiling rack must maintain at least 3 inches of vertical clearance above the highest point of the garage door's horizontal tracks and automatic opener rail. For vehicle parking underneath, maintain a minimum of 6 inches of clearance above your vehicle's roof line or roof box.
      </p>

      <h2>5. Safe Loading Protocol for Seasonal Items</h2>
      <p>
        Reserve overhead racks for lightweight, bulky seasonal items: holiday trees, luggage, empty cooler boxes, and seasonal plastic totes. Avoid storing daily-use tools or excessively dense hardware overhead where ladder retrieval poses safety risks.
      </p>

      <!-- Practical Checklist Box -->
      <div class="p-4 rounded border my-4" style="background-color: var(--bg-surface); border-color: var(--border-color);">
        <h4 class="mb-3"><i class="fas fa-shield-halved me-2" style="color:var(--text-heading)"></i> Ceiling Storage Safety Rules</h4>
        <ul class="list-unstyled mb-0">
          <li class="d-flex align-items-center gap-2 mb-2"><i class="fas fa-check text-muted"></i> Joist center alignment verified with stud sensor & pilot probe</li>
          <li class="d-flex align-items-center gap-2 mb-2"><i class="fas fa-check text-muted"></i> 5/16" heavy-gauge structural lag bolts installed with washers</li>
          <li class="d-flex align-items-center gap-2 mb-2"><i class="fas fa-check text-muted"></i> 3"+ garage door roll track clearance verified</li>
          <li class="d-flex align-items-center gap-2 mb-2"><i class="fas fa-check text-muted"></i> Loads distributed evenly with heaviest items near ceiling drop posts</li>
        </ul>
      </div>

      <!-- Article Footer CTA -->
      <div class="p-4 p-md-5 rounded border mt-5 text-center" style="background-color: var(--bg-surface); border-color: var(--border-color); border-radius: var(--radius-lg);">
        <h3 class="mb-2">Need Professional Overhead Installation?</h3>
        <p class="text-muted mb-4">Our certified installers evaluate your ceiling joists and securely anchor heavy-duty overhead platform racks with guaranteed safety.</p>
        <a href="contact.html" class="btn btn-primary btn-lg">
          <i class="fas fa-calendar-check me-2"></i> Book Overhead Installation
        </a>
      </div>
    `
  },

  'seasonal-storage-rotation': {
    id: 'seasonal-storage-rotation',
    aliases: ['seasonal', 'seasonal-storage-rotation', 'seasonal-rotation', 'summer-to-winter'],
    title: 'Seasonal Storage Rotation: Summer to Winter',
    category: 'seasonal',
    categoryName: 'Seasonal Rotation',
    date: 'August 2026',
    readTime: '4 min read',
    author: 'Home Logistics & Efficiency Advisor',
    summary: 'How to organize labeled totes and slide-out bin racks to swap seasonal camping gear with snow equipment in under 30 minutes.',
    mainImg: 'assets/images/residential-seasonal-storage.jpg',
    keywords: ['seasonal', 'rotation', 'seasonal rotation', 'summer to winter', 'totes', 'bins', 'camping', 'snow', 'slide-out racks', 'labeling', 'indexing'],
    relatedIds: ['ceiling-storage-safety', 'shelving-rules', 'garage-declutter-psychology'],
    content: `
      <p class="lead">
        Twice a year, homeowners face the seasonal gear migration: swapping lawnmowers and camping tents for snow blowers and holiday decor. With a structured seasonal rotation system, this switch takes less than 30 minutes without rearranging your entire garage.
      </p>

      <h2>1. The Bi-Annual 30-Minute Rotation Strategy</h2>
      <p>
        The core philosophy of seasonal garage rotation is having two dedicated active zones: Prime Eye-Level Access (the reachable zone between 30 and 72 inches) and Long-Term Upper Storage (shelves above 72 inches or ceiling racks). Only items for the current active season should occupy Prime Eye-Level Access.
      </p>

      <h2>2. Slide-Out Bin Racks: The End of "Tote Stacking"</h2>
      <p>
        Traditional tote stacking requires unstacking four 50-lb boxes just to access the bottom container. Modular bin-slider racks support each tote on individual horizontal steel rails, allowing every bin to slide out like a drawer independently.
      </p>

      <div class="article-featured-quote">
        "If retrieving your winter gear requires moving four other boxes, your system isn't working for you. Single-action retrieval is the golden standard."
      </div>

      <h2>3. High-Contrast Color Coding and QR Indexing</h2>
      <p>
        Use uniform heavy-duty plastic totes with colored lids (e.g., green/red for holiday decorations, blue for summer aquatic gear, yellow for automotive tools). Affix scannable QR code index labels linked to a simple digital inventory note on your smartphone so you know the contents of every tote before pulling it down.
      </p>

      <h2>4. Dedicated Wall Tracks for Seasonal Power Equipment</h2>
      <p>
        Utilize heavy-duty modular wall hooks that accept both lawn trimmers and leaf blowers in the summer, and transition to snow shovels, roof rakes, and ski bags in the winter with a single tool-free clip adjustment.
      </p>

      <!-- Practical Checklist Box -->
      <div class="p-4 rounded border my-4" style="background-color: var(--bg-surface); border-color: var(--border-color);">
        <h4 class="mb-3"><i class="fas fa-rotate me-2" style="color:var(--text-heading)"></i> 30-Minute Rotation Checklist</h4>
        <ul class="list-unstyled mb-0">
          <li class="d-flex align-items-center gap-2 mb-2"><i class="fas fa-check text-muted"></i> Move outgoing summer gear to upper shelves or overhead platform</li>
          <li class="d-flex align-items-center gap-2 mb-2"><i class="fas fa-check text-muted"></i> Lower incoming winter totes and snow gear to eye-level shelving</li>
          <li class="d-flex align-items-center gap-2 mb-2"><i class="fas fa-check text-muted"></i> Swap wall tool hooks for winter shovels and ice melt station</li>
          <li class="d-flex align-items-center gap-2 mb-2"><i class="fas fa-check text-muted"></i> Update tote QR inventory labels for newly added items</li>
        </ul>
      </div>

      <!-- Article Footer CTA -->
      <div class="p-4 p-md-5 rounded border mt-5 text-center" style="background-color: var(--bg-surface); border-color: var(--border-color); border-radius: var(--radius-lg);">
        <h3 class="mb-2">Need a Custom Seasonal Storage System?</h3>
        <p class="text-muted mb-4">We design slide-out bin racks and modular tote storage solutions that make seasonal rotation effortless.</p>
        <a href="contact.html" class="btn btn-primary btn-lg">
          <i class="fas fa-calendar-check me-2"></i> Book Storage Consultation
        </a>
      </div>
    `
  },

  'garage-declutter-psychology': {
    id: 'garage-declutter-psychology',
    aliases: ['decluttering', 'garage-declutter-psychology', 'psychology-decluttering', 'declutter', 'psychology-of-decluttering'],
    title: 'The Psychology of Decluttering: 5 Steps to Reclaim Order',
    category: 'decluttering',
    categoryName: 'Decluttering Tips',
    date: 'July 2026',
    readTime: '5 min read',
    author: 'Spatial Wellness & Organization Consultant',
    summary: 'Overcome decision fatigue when sorting through years of accumulated boxes, tools, and unused household items.',
    mainImg: 'assets/images/residential-garage-decluttering.jpg',
    keywords: ['decluttering', 'psychology', 'declutter', 'mindset', 'sorting', 'decision fatigue', 'order', 'reclaim order', '5 steps', 'decluttering tips'],
    relatedIds: ['single-car-garage', 'shelving-rules', 'seasonal-storage-rotation'],
    content: `
      <p class="lead">
        The garage is often the most cluttered room in a home because it acts as the default holding zone for items without a defined place. Tackling decades of accumulation isn't just a physical challenge—it's a psychological one.
      </p>

      <h2>1. Overcoming "Garage Clutter Gravity" and Decision Fatigue</h2>
      <p>
        When faced with 50 unorganized boxes, the brain experiences rapid decision fatigue within 45 minutes. To succeed, break the garage down into manageable 4-foot by 4-foot zones. Never attempt to empty the entire garage at once. Focus solely on completing one sector before moving to the next.
      </p>

      <h2>2. The Four-Category Sorting Protocol</h2>
      <p>
        Stage four clear staging areas on the driveway:
      </p>
      <ol>
        <li><strong>Keep & Categorize:</strong> Items used within the past 12 months with a designated future home.</li>
        <li><strong>Donate / Gift:</strong> Useful tools, working sports gear, and furniture ready for community reuse.</li>
        <li><strong>Sell:</strong> High-value machinery or collectible items committed to marketplace sale within 14 days.</li>
        <li><strong>Dispose / Recycle:</strong> Expired paint, broken materials, and hazardous fluids for municipal recycling.</li>
      </ol>

      <div class="article-featured-quote">
        "Clutter in the garage is rarely about a lack of space; it is about deferred decisions. Once each category has a home, order becomes effortless."
      </div>

      <h2>3. The 12-Month Utility Rule</h2>
      <p>
        If an item has sat untouched in the garage for more than 12 consecutive months, it has passed through all four seasons without being needed. Unless it is specialized emergency equipment or heirloom memorabilia, it should be released to someone who will use it.
      </p>

      <h2>4. Define Physical Boundaries Before Buying Cabinets</h2>
      <p>
        Buying storage bins before purging leads to neatly organizing useless junk. Purge down to your true essentials first, categorize similar items together, and then measure the exact linear footage of shelving or cabinet space needed to house them.
      </p>

      <h2>5. Establish the "One In, One Out" Habit</h2>
      <p>
        To maintain a clean garage permanently, implement the one-in, one-out rule for large items like sports equipment, tools, and storage bins. Every new addition must replace an existing item to prevent gradual re-cluttering.
      </p>

      <!-- Practical Checklist Box -->
      <div class="p-4 rounded border my-4" style="background-color: var(--bg-surface); border-color: var(--border-color);">
        <h4 class="mb-3"><i class="fas fa-brain me-2" style="color:var(--text-heading)"></i> 5-Step Declutter Mindset</h4>
        <ul class="list-unstyled mb-0">
          <li class="d-flex align-items-center gap-2 mb-2"><i class="fas fa-check text-muted"></i> Work in 4x4 ft micro-zones to eliminate decision fatigue</li>
          <li class="d-flex align-items-center gap-2 mb-2"><i class="fas fa-check text-muted"></i> Stage Keep, Donate, Sell, and Dispose tarps on driveway</li>
          <li class="d-flex align-items-center gap-2 mb-2"><i class="fas fa-check text-muted"></i> Apply the strict 12-month utility rule across all boxes</li>
          <li class="d-flex align-items-center gap-2 mb-2"><i class="fas fa-check text-muted"></i> Measure remaining inventory before installing storage systems</li>
        </ul>
      </div>

      <!-- Article Footer CTA -->
      <div class="p-4 p-md-5 rounded border mt-5 text-center" style="background-color: var(--bg-surface); border-color: var(--border-color); border-radius: var(--radius-lg);">
        <h3 class="mb-2">Need Professional Garage Space Organization?</h3>
        <p class="text-muted mb-4">Our organization team helps you sort, plan, and install custom shelving and cabinetry to keep your garage permanently clutter-free.</p>
        <a href="contact.html" class="btn btn-primary btn-lg">
          <i class="fas fa-calendar-check me-2"></i> Book Free Consultation
        </a>
      </div>
    `
  }
};

/* Helper to resolve article by ID or alias */
function resolveBlogArticle(id) {
  if (!id) return blogDatabase['shelving-rules'];
  const cleanId = id.toLowerCase().trim();
  if (blogDatabase[cleanId]) return blogDatabase[cleanId];
  for (const key in blogDatabase) {
    if (blogDatabase[key].aliases && blogDatabase[key].aliases.includes(cleanId)) {
      return blogDatabase[key];
    }
  }
  return null;
}

/* ==========================================================================
   4A. BLOG SEARCH & FILTERING (FOR blog.html)
   ========================================================================== */
function initBlog() {
  const searchInput = document.getElementById('blogSearchInput');
  const searchForm = document.getElementById('blogSearchForm');
  const catButtons = document.querySelectorAll('.blog-cat-btn');
  const articleCards = document.querySelectorAll('.blog-article-card');
  const noResultsMsg = document.getElementById('blogNoResults');
  const resetBtn = document.getElementById('blogResetBtn');

  if (!searchInput && catButtons.length === 0 && articleCards.length === 0) return;

  function filterArticles() {
    const query = (searchInput ? searchInput.value.toLowerCase().trim() : '');
    const activeCatBtn = document.querySelector('.blog-cat-btn.active');
    const selectedCat = activeCatBtn ? activeCatBtn.getAttribute('data-cat') : 'all';

    let visibleCount = 0;

    articleCards.forEach(card => {
      const title = card.querySelector('.article-title')?.textContent.toLowerCase() || '';
      const desc = card.querySelector('.article-desc')?.textContent.toLowerCase() || '';
      const category = card.getAttribute('data-category') || '';
      const keywords = card.getAttribute('data-keywords')?.toLowerCase() || '';

      const matchesQuery = query === '' || 
                           title.includes(query) || 
                           desc.includes(query) || 
                           category.includes(query) ||
                           keywords.includes(query);
      const matchesCat = selectedCat === 'all' || category === selectedCat;

      if (matchesQuery && matchesCat) {
        card.style.display = 'block';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (noResultsMsg) {
      noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  function setCategory(catSlug) {
    let matched = false;
    catButtons.forEach(btn => {
      if (btn.getAttribute('data-cat') === catSlug) {
        btn.classList.add('active');
        matched = true;
      } else {
        btn.classList.remove('active');
      }
    });
    if (!matched && catButtons.length > 0) {
      catButtons[0].classList.add('active');
    }
    filterArticles();
  }

  // Parse URL query parameters on load
  const urlParams = new URLSearchParams(window.location.search);
  const initialCat = urlParams.get('category');
  const initialSearch = urlParams.get('search');

  if (initialSearch && searchInput) {
    searchInput.value = initialSearch;
  }

  if (initialCat) {
    setCategory(initialCat);
  } else {
    filterArticles();
  }

  // Live input filter
  if (searchInput) {
    searchInput.addEventListener('input', filterArticles);
  }

  // Form submit on Enter or Search button click
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      filterArticles();
    });
  }

  // Category filter button clicks
  if (catButtons.length > 0) {
    catButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const cat = btn.getAttribute('data-cat');
        catButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterArticles();
        const newUrl = cat === 'all' ? 'blog.html' : `blog.html?category=${encodeURIComponent(cat)}`;
        window.history.pushState({ category: cat }, '', newUrl);
      });
    });
  }

  // Reset button in No Results state
  if (resetBtn) {
    resetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (searchInput) searchInput.value = '';
      setCategory('all');
      window.history.pushState({}, '', 'blog.html');
    });
  }

  // Browser back / forward navigation
  window.addEventListener('popstate', () => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category') || 'all';
    const s = params.get('search') || '';
    if (searchInput) searchInput.value = s;
    setCategory(cat);
  });
}

/* ==========================================================================
   4B. DYNAMIC BLOG DETAILS PAGE (FOR blog-details.html)
   ========================================================================== */
function initBlogDetails() {
  const container = document.getElementById('blogDetailContainer');
  if (!container) return;

  function getArticleId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id') || 'shelving-rules';
  }

  function renderArticle(requestedId) {
    const article = resolveBlogArticle(requestedId);

    if (!article) {
      container.innerHTML = `
        <div class="text-center py-5">
          <i class="fas fa-file-circle-question fa-3x text-muted mb-3"></i>
          <h3>Article Not Found</h3>
          <p class="text-muted">The requested storage guide could not be located or may have been moved.</p>
          <a href="blog.html" class="btn btn-primary mt-2"><i class="fas fa-arrow-left me-2"></i> Back to All Guides</a>
        </div>
      `;
      document.title = 'Article Not Found — GarageOrg';
      return;
    }

    // Update document title and meta description
    document.title = `${article.title} — GarageOrg Guide`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', article.summary);

    // Update breadcrumb
    const breadcrumbActive = document.querySelector('.breadcrumb-active');
    if (breadcrumbActive) breadcrumbActive.textContent = 'Blog Details';

    // Render main article container with exactly ONE main image
    container.innerHTML = `
      <span class="badge-tag mb-3" id="blogDetailBadge">${article.categoryName}</span>
      <h1 class="h2 fw-bold mb-3" id="blogDetailTitle">${article.title}</h1>
      <div class="article-meta mb-4 pb-3 border-bottom d-flex flex-wrap gap-3 text-muted small" id="blogDetailMeta">
        <span><i class="far fa-calendar-alt me-1"></i> ${article.date}</span>
        <span><i class="far fa-user me-1"></i> ${article.author}</span>
        <span><i class="far fa-clock me-1"></i> ${article.readTime}</span>
      </div>

      <!-- Single Main Article Image (Strictly one image for the article body) -->
      <div class="mb-4" style="border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--card-shadow);">
        <img id="blogDetailMainImg" src="${article.mainImg}" alt="${article.title}" class="w-100" style="height: 420px; object-fit: cover; display: block;">
      </div>

      <div id="blogDetailBody">
        ${article.content}
      </div>
    `;

    // Render Related Articles dynamically in sidebar
    const relatedList = document.getElementById('blogRelatedList');
    if (relatedList && article.relatedIds) {
      const relatedHtml = article.relatedIds.map(relId => {
        const relArticle = blogDatabase[relId];
        if (!relArticle) return '';
        return `
          <div class="d-flex gap-3 mb-3 pb-3 border-bottom" style="border-color: var(--border-color) !important;">
            <a href="blog-details.html?id=${relArticle.id}" class="flex-shrink-0">
              <img src="${relArticle.mainImg}" alt="${relArticle.title}" style="width: 75px; height: 75px; object-fit: cover; border-radius: var(--radius-sm);">
            </a>
            <div>
              <a href="blog-details.html?id=${relArticle.id}" class="fw-bold d-block small mb-1 blog-related-link" data-id="${relArticle.id}">${relArticle.title}</a>
              <small class="text-muted"><i class="far fa-clock me-1"></i> ${relArticle.readTime}</small>
            </div>
          </div>
        `;
      }).join('');
      relatedList.innerHTML = relatedHtml;

      // Add click listeners to related articles for smooth client navigation
      relatedList.querySelectorAll('.blog-related-link').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = link.getAttribute('data-id');
          window.history.pushState({ id: targetId }, '', `blog-details.html?id=${targetId}`);
          renderArticle(targetId);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      });
    }
  }

  // Initial render
  const currentId = getArticleId();
  renderArticle(currentId);

  // Popstate listener for back/forward navigation
  window.addEventListener('popstate', (e) => {
    const id = (e.state && e.state.id) ? e.state.id : getArticleId();
    renderArticle(id);
  });
}

/* ==========================================================================
   5. DYNAMIC SERVICE DETAILS PAGE
   ========================================================================== */
const serviceDatabase = {
  'shelving': {
    title: 'Custom Garage Shelving Systems',
    tag: 'Heavy-Duty Storage',
    heroImg: 'assets/images/service-detail-hero.jpg',
    mainImg: 'assets/images/service-1-shelving.jpg',
    desc: 'Our custom garage shelving systems are engineered to turn raw wall capacity into high-efficiency storage. Built using industrial powder-coated steel uprights and solid steel or heavy-duty timber deck inlays, each shelf can carry up to 800 lbs with zero deflection.',
    bullets: [
      'Adjustable shelf brackets with 1.5-inch vertical increments',
      'Continuous wall-track mounting distributes weight across studs',
      'Corrosion-resistant matte black powder coat finish',
      'Custom sizing tailored around outlets, doors, and vehicle clearances'
    ],
    features: [
      { icon: 'fa-layer-group', title: 'Modular Uprights', text: 'Easily rearrange shelf heights as storage needs evolve over the seasons.' },
      { icon: 'fa-shield-halved', title: 'Tested 800 lb Capacity', text: 'Engineered heavy-gauge steel supports serious workshop gear and heavy tubs safely.' },
      { icon: 'fa-wrench', title: 'Stud Anchored', text: 'Secure multi-point wall stud fastening guarantees complete peace of mind.' }
    ]
  },
  'cabinets': {
    title: 'Garage Cabinets & Lockable Storage Units',
    tag: 'Enclosed Organization',
    heroImg: 'assets/images/service-detail-hero.jpg',
    mainImg: 'assets/images/service-2-cabinets.jpg',
    desc: 'Keep power tools, hazardous chemicals, and detailing gear securely hidden away with custom-fitted steel garage cabinetry. Designed with soft-close European hinges, integrated lock cores, and full-extension bearing slides.',
    bullets: [
      'Double-walled 18-gauge cold rolled steel construction',
      'Fully lockable key and cylinder security systems',
      'Waterproof adjustable leveling feet to compensate for floor slope',
      'Integrated cable routing grommets for internal charging stations'
    ],
    features: [
      { icon: 'fa-lock', title: 'Secure Locking', text: 'Keep dangerous fluids and expensive equipment safely locked away.' },
      { icon: 'fa-door-closed', title: 'Dust & Moisture Seal', text: 'Full door perimeter gaskets keep garage grime out of your items.' },
      { icon: 'fa-cubes', title: 'Modular Stacking', text: 'Base cabinets, tall wardrobes, and upper wall modules configured to fit.' }
    ]
  },
  'workbench': {
    title: 'Custom Workbench & Utility Stations',
    tag: 'Craftsmanship & Utility',
    heroImg: 'assets/images/service-detail-hero.jpg',
    mainImg: 'assets/images/service-3-workbench.jpg',
    desc: 'A dedicated workspace tailored for DIY projects, home repairs, and precision work. Includes thick solid butcher block work surfaces, integrated power strips with USB ports, under-mount LED task lighting, and ball-bearing drawer banks.',
    bullets: [
      '1.75-inch solid maple or rubberwood butcher block top',
      'Integrated multi-outlet surge protector and quick-charge USB ports',
      'Heavy-duty 100-lb capacity smooth ball bearing drawer slides',
      'Custom width options from 48 inches to 120 inches continuous'
    ],
    features: [
      { icon: 'fa-hammer', title: 'Hardwood Worktops', text: 'Impact resistant, sealed butcher block built for decades of active projects.' },
      { icon: 'fa-bolt', title: 'Integrated Power', text: 'Built-in electrical distribution for tools, chargers, and task lights.' },
      { icon: 'fa-table-cells', title: 'Direct Slatwall Match', text: 'Seamless transition between workbench backing and wall organization.' }
    ]
  },
  'tools': {
    title: 'Wall-Mounted Slatwall & Tool Storage',
    tag: 'Precision Wall Grid',
    heroImg: 'assets/images/service-detail-hero.jpg',
    mainImg: 'assets/images/service-4-tools.jpg',
    desc: 'Reclaim your floor space by hanging garden tools, ladders, cords, and hand tools neatly on high-density PVC or aluminum slatwall panels. Modular hooks, baskets, and magnetic strips lock securely in place and reposition in seconds.',
    bullets: [
      'Heavy-duty cellular PVC slatwall panels supporting 75 lbs per sq ft',
      'Proprietary Cam-Lok hook mechanism prevents hooks from falling off',
      'Color-matched finishing trims and hidden screw channels',
      'Compatible with over 40 specialized hooks, baskets, and brackets'
    ],
    features: [
      { icon: 'fa-border-all', title: 'Universal Grid', text: 'Hang hand tools, brooms, shovels, cords, and blowers in plain sight.' },
      { icon: 'fa-arrows-rotate', title: '1-Second Repositioning', text: 'Rearrange hooks whenever you add new tools without drilling new holes.' },
      { icon: 'fa-droplet-slash', title: 'Moisture Proof', text: '100% waterproof materials will never warp, rot, or degrade.' }
    ]
  },
  'overhead': {
    title: 'Overhead & Ceiling Storage Racks',
    tag: 'Vertical Ceiling Optimization',
    heroImg: 'assets/images/service-detail-hero.jpg',
    mainImg: 'assets/images/service-5-overhead.jpg',
    desc: 'Unlock the massive unused storage zone above your garage door and overhead ceiling joists. Heavy-gauge ceiling platform racks safely support large plastic totes, holiday decor, luggage, and bulky seasonal gear up to 600 lbs.',
    bullets: [
      'Multi-joist mounting brackets with grade-5 lag bolts',
      'Industrial teardrop wire deck platforms preventing dust accumulation',
      'Adjustable drop height from 18 to 44 inches to clear garage doors',
      'Available with motorized motorized lifting mechanisms for effortless access'
    ],
    features: [
      { icon: 'fa-arrow-up', title: 'Unlocks Dead Space', text: 'Utilize high ceilings above car parking zones without sacrificing headroom.' },
      { icon: 'fa-weight-hanging', title: 'Heavy Load Rated', text: 'Rigid steel safety trusses engineered for 600 lb static storage loads.' },
      { icon: 'fa-car', title: 'Safe Car Clearance', text: 'Positioned precisely to ensure seamless clearance for SUVs and liftgates.' }
    ]
  },
  'sports': {
    title: 'Sports & Outdoor Equipment Organization',
    tag: 'Active Lifestyle Storage',
    heroImg: 'assets/images/service-detail-hero.jpg',
    mainImg: 'assets/images/service-6-sports.jpg',
    desc: 'Specialized wall rigs and vertical racks designed for bicycles, golf bags, skis, kayaks, skateboards, and ball bins. Keeps high-value athletic gear protected from damage and ready for your next adventure.',
    bullets: [
      'Rubber-coated vertical and horizontal bike swivel mounts',
      'Dedicated dual golf bag stations with shoe and accessory shelving',
      'Wall and ceiling suspension cradles for kayaks, surfboards, and canoes',
      'Heavy-duty elastic mesh ball cages for easy grabbing'
    ],
    features: [
      { icon: 'fa-bicycle', title: 'Bike Swivel Racks', text: 'Pivoting wall arms allow bikes to fold flat against the wall for space.' },
      { icon: 'fa-person-skiing', title: 'Seasonal Sports Racks', text: 'Custom clips for skis, snowboards, fishing rods, and tennis rackets.' },
      { icon: 'fa-shield-heart', title: 'Protective Rubber Coating', text: 'Prevents scratches on carbon frames and premium equipment rims.' }
    ]
  },
  'seasonal': {
    title: 'Seasonal Item & Holiday Storage',
    tag: 'Organized Rotation',
    heroImg: 'assets/images/service-detail-hero.jpg',
    mainImg: 'assets/images/service-7-seasonal.jpg',
    desc: 'Structured bin shelving, labeled color-coded tote systems, and dedicated zones for seasonal decorations, winter tires, patio furniture cushions, and camping supplies. Designed for quick semi-annual rotation.',
    bullets: [
      'Bin-slider storage racks allowing bins to slide out individually like drawers',
      'Heavy-duty tire racks for safe summer and winter wheel storage',
      'Labeling indexing systems for instantaneous item retrieval',
      'Airtight and weather-sealed tote recommendations'
    ],
    features: [
      { icon: 'fa-calendar-days', title: 'Effortless Rotation', text: 'Swap summer camping gear with winter snow equipment in minutes.' },
      { icon: 'fa-boxes-stacked', title: 'No-Stack Sliding Racks', text: 'Pull out bottom totes without lifting the entire stack of heavy containers.' },
      { icon: 'fa-tags', title: 'Smart Indexing', text: 'Clear label systems ensure whole families can find holiday items.' }
    ]
  },
  'complete': {
    title: 'Complete Garage Transformations',
    tag: 'Full Turnkey Makeovers',
    heroImg: 'assets/images/service-detail-hero.jpg',
    mainImg: 'assets/images/service-8-complete.jpg',
    desc: 'Our signature whole-garage makeover service. We combine polyaspartic floor coating, full wall slatwall systems, custom cabinetry suites, overhead racks, and modern LED illumination into a showroom-quality living space.',
    bullets: [
      'Full 3D CAD design visualization prior to project commencement',
      'Commercial grade epoxy and polyaspartic floor finishing',
      'Integrated electrical, lighting, and workspace power layout',
      'Turnkey project management from decluttering to final handoff'
    ],
    features: [
      { icon: 'fa-wand-magic-sparkles', title: 'End-to-End Execution', text: 'From demolition and wall prep to final custom cabinetry installation.' },
      { icon: 'fa-gem', title: 'Showroom Finish', text: 'Premium polyaspartic flake floors and architectural matte black storage.' },
      { icon: 'fa-house', title: 'Expands Usable Home Space', text: 'Turns a cluttered concrete bay into a functional extension of your home.' }
    ]
  },
  'planning': {
    title: 'Garage Space Planning & 3D Layout Design',
    tag: 'Precision Engineering',
    heroImg: 'assets/images/service-detail-hero.jpg',
    mainImg: 'assets/images/service-9-planning.jpg',
    desc: 'Professional architectural space planning to maximize every cubic inch of your garage. We measure your garage, scan for obstacles and clearance zones, and produce detailed 3D CAD layout models tailored to your vehicles and storage needs.',
    bullets: [
      'Exact laser-measured dimensions and obstacle clearance checks',
      'Photorealistic 3D rendering allowing full review before build',
      'Vehicle parking clearance simulation and swing-door verification',
      'Itemized material breakdown and phased installation roadmap'
    ],
    features: [
      { icon: 'fa-compass-drafting', title: 'Precision Laser Mapping', text: 'Accounts for electrical panels, water heaters, and garage door tracks.' },
      { icon: 'fa-vr-cardboard', title: '3D Visual Renderings', text: 'See exactly what your transformed garage will look like in high definition.' },
      { icon: 'fa-clipboard-check', title: 'Customized Storage Audit', text: 'Calculates exact linear and cubic storage required for your inventory.' }
    ]
  },
  'decluttering': {
    title: 'Garage Decluttering & Space Recovery',
    tag: 'Systematic Organization',
    heroImg: 'assets/images/service-detail-hero.jpg',
    mainImg: 'assets/images/residential-garage-decluttering.jpg',
    desc: 'Eliminate floor chaos, reclaim valuable parking square footage, and establish a permanent organizational framework. Our hands-on decluttering team sorts, purges, categorizes, and labels your entire garage inventory into dedicated functional zones.',
    bullets: [
      '5-stage structured purge, sorting, donation, and recycling workflow',
      '100% floor clearance achieved for comfortable dual-vehicle parking',
      'Heavy-duty clear tote containment with high-contrast printed labeling',
      'Long-term maintenance systems designed to keep garages perpetually clutter-free'
    ],
    features: [
      { icon: 'fa-box-open', title: 'Categorized Sorting', text: 'Separate tools, sports gear, holiday decor, and automotive supplies into dedicated zones.' },
      { icon: 'fa-trash-can', title: 'Purge & Donation', text: 'Systematic sorting to identify donation items, recyclables, and unwanted clutter.' },
      { icon: 'fa-tags', title: 'Smart Labeling', text: 'Find any tool or seasonal container in under 30 seconds with clean bin indexing.' }
    ]
  }
};

// Aliases for friendly service query parameter mapping
const serviceAliases = {
  'overhead-racks': 'overhead',
  'overhead_racks': 'overhead',
  'ceiling-racks': 'overhead',
  'tool-storage': 'tools',
  'tool_storage': 'tools',
  'wall-storage': 'tools',
  'custom-shelving': 'shelving',
  'shelves': 'shelving',
  'garage-cabinets': 'cabinets',
  'cabinets-storage': 'cabinets',
  'workbenches': 'workbench',
  'workbench-stations': 'workbench',
  'garage-decluttering': 'decluttering',
  'space-planning': 'planning',
  'full-transformation': 'complete',
  'transformations': 'complete'
};

function initServiceDetails() {
  const serviceDetailContainer = document.getElementById('serviceDetailContainer');
  const serviceNavItems = document.querySelectorAll('.service-nav-item');

  if (!serviceDetailContainer) return;

  function resolveServiceKey(rawKey) {
    if (!rawKey) return 'shelving';
    const cleanKey = rawKey.toLowerCase().trim();
    if (serviceDatabase[cleanKey]) return cleanKey;
    if (serviceAliases[cleanKey] && serviceDatabase[serviceAliases[cleanKey]]) {
      return serviceAliases[cleanKey];
    }
    return 'shelving';
  }

  function getServiceFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return resolveServiceKey(urlParams.get('service'));
  }

  function renderService(key) {
    const canonicalKey = resolveServiceKey(key);
    const data = serviceDatabase[canonicalKey] || serviceDatabase['shelving'];

    // Update document title
    document.title = `${data.title} — GarageOrg Services`;

    // Update active nav button
    serviceNavItems.forEach(item => {
      const itemKey = resolveServiceKey(item.getAttribute('data-service'));
      if (itemKey === canonicalKey) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Render detail content
    serviceDetailContainer.innerHTML = `
      <div class="custom-card mb-4">
        <div class="card-img-top-wrap" style="height: 380px;">
          <img src="${data.mainImg}" alt="${data.title}" style="width: 100%; height: 100%; object-fit: cover;">
          <span class="card-badge">${data.tag}</span>
        </div>
        <div class="custom-card-body p-4 p-md-5">
          <span class="badge-tag mb-3">${data.tag}</span>
          <h2 class="mb-3">${data.title}</h2>
          <p class="lead mb-4">${data.desc}</p>

          <h4 class="mt-4 mb-3">Key Solution Features & Engineering Specs</h4>
          <ul class="list-unstyled mb-4">
            ${data.bullets.map(b => `
              <li class="d-flex align-items-start gap-2 mb-2">
                <i class="fas fa-check-circle mt-1" style="color: var(--text-heading)"></i>
                <span>${b}</span>
              </li>
            `).join('')}
          </ul>

          <div class="row g-3 my-4">
            ${data.features.map(f => `
              <div class="col-md-4">
                <div class="p-3 rounded border" style="background-color: var(--bg-surface); border-color: var(--border-color);">
                  <i class="fas ${f.icon} mb-2" style="font-size: 1.4rem; color: var(--text-heading)"></i>
                  <h5 class="h6 mb-1">${f.title}</h5>
                  <p class="small mb-0 text-muted">${f.text}</p>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="p-4 rounded border mt-4 text-center" style="background-color: var(--bg-surface); border-color: var(--border-color);">
            <h4 class="mb-2">Ready to implement this solution in your garage?</h4>
            <p class="mb-3 text-muted">Schedule a free space planning consultation with our storage specialists.</p>
            <a href="contact.html" class="btn btn-primary btn-lg">
              <i class="fas fa-calendar-check me-2"></i> Book a Consultation
            </a>
          </div>
        </div>
      </div>
    `;
  }

  // Initial render
  const initialKey = getServiceFromUrl();
  renderService(initialKey);

  // Click listeners for sidebar nav
  serviceNavItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceKey = item.getAttribute('data-service');
      const canonicalKey = resolveServiceKey(serviceKey);
      renderService(canonicalKey);
      window.history.pushState({ service: canonicalKey }, '', `service-details.html?service=${canonicalKey}`);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    });
  });

  // Popstate listener for back/forward navigation
  window.addEventListener('popstate', (e) => {
    const key = (e.state && e.state.service) ? e.state.service : getServiceFromUrl();
    renderService(key);
  });
}

/* ==========================================================================
   6. CONTACT FORM VALIDATION & VERIFICATION
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('consultationContactForm');
  const alertBox = document.getElementById('contactFormFeedback');

  if (!contactForm || !alertBox) return;

  let feedbackTimer = null;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Clear any existing timer from previous submissions
    if (feedbackTimer) {
      clearTimeout(feedbackTimer);
      feedbackTimer = null;
    }

    const nameInput = contactForm.querySelector('#contactName');
    const emailInput = contactForm.querySelector('#contactEmail');
    const phoneInput = contactForm.querySelector('#contactPhone');
    const serviceInput = contactForm.querySelector('#contactService');
    const messageInput = contactForm.querySelector('#contactMessage');

    // Validation
    let isValid = true;
    let errorMessage = '';

    if (!nameInput.value.trim()) {
      isValid = false;
      errorMessage = 'Please enter your full name.';
      nameInput.focus();
    } else if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
      isValid = false;
      errorMessage = 'Please enter a valid email address.';
      emailInput.focus();
    } else if (!serviceInput.value) {
      isValid = false;
      errorMessage = 'Please select a storage service.';
      serviceInput.focus();
    } else if (!messageInput.value.trim()) {
      isValid = false;
      errorMessage = 'Please provide a brief message or garage dimensions.';
      messageInput.focus();
    }

    if (!isValid) {
      alertBox.className = 'form-feedback-alert show alert alert-warning';
      alertBox.innerHTML = `<i class="fas fa-exclamation-triangle mt-1"></i> <div><span>${errorMessage}</span></div>`;
      alertBox.style.setProperty('display', 'flex', 'important');
      return;
    }

    // Success feedback (Client-side demo verification state)
    const selectedServiceText = serviceInput.options[serviceInput.selectedIndex] ? serviceInput.options[serviceInput.selectedIndex].text : 'Selected Service';
    const submittedName = nameInput.value.trim();

    alertBox.className = 'form-feedback-alert show alert alert-success';
    alertBox.innerHTML = `
      <i class="fas fa-check-circle fa-2x mt-1" style="color: #0F5132;"></i>
      <div>
        <strong style="color: #0B4127;">Thank you, ${submittedName}!</strong>
        <p class="mb-0 small" style="color: #14532D;">Your consultation request for <em style="color: #0B4127;">${selectedServiceText}</em> has been prepared. Our storage specialists will reach out via email shortly.</p>
      </div>
    `;
    alertBox.style.setProperty('display', 'flex', 'important');
    contactForm.reset();

    // Automatically hide/remove success notification after exactly 5 seconds (5000ms)
    feedbackTimer = setTimeout(() => {
      alertBox.style.setProperty('display', 'none', 'important');
      alertBox.style.display = 'none';
      alertBox.className = 'form-feedback-alert hide';
      alertBox.innerHTML = '';
      feedbackTimer = null;
    }, 5000);
  });
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/* ==========================================================================
   7. NEWSLETTER SUBSCRIPTION
   ========================================================================== */
function initNewsletter() {
  const forms = document.querySelectorAll('.newsletter-form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn = form.querySelector('button');
      
      if (input && validateEmail(input.value.trim())) {
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Subscribed';
        btn.disabled = true;
        input.value = '';
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.disabled = false;
        }, 4000);
      } else if (input) {
        input.focus();
      }
    });
  });
}
