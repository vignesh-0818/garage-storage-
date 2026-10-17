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
  const urlParams = new URLSearchParams(window.location.search);
  const themeParam = urlParams.get('theme');
  if (themeParam === 'dark' || themeParam === 'light') {
    localStorage.setItem('garage_theme', themeParam);
  }
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
   2. RTL / LTR DIRECTION TOGGLE (LAYOUT DIRECTION ONLY - ALL TEXT REMAINS ENGLISH)
   ========================================================================== */
function initDirection() {
  const rtlToggleBtns = document.querySelectorAll('.rtl-toggle-btn');
  const urlParams = new URLSearchParams(window.location.search);
  const dirParam = urlParams.get('dir');
  if (dirParam === 'rtl' || dirParam === 'ltr') {
    localStorage.setItem('garage_dir', dirParam);
  }
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
   3. GALLERY FILTERING (SHOWING PROJECT NAMES ON HOVER, ZERO CLICK POPUPS)
   ========================================================================== */
function initGallery() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        galleryItems.forEach(item => {
          const category = item.getAttribute('data-category') || '';
          const categoryList = category.split(/\s+/);
          if (filterValue === 'all' || category === filterValue || categoryList.includes(filterValue)) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
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
    heroImg: 'assets/images/blog-detail-hero.jpg',
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
    heroImg: 'assets/images/after-1.jpg',
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
    heroImg: 'assets/images/tool-organizer-slatwall.jpg',
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
    heroImg: 'assets/images/home-feat-overhead.jpg',
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
    heroImg: 'assets/images/residential-seasonal-storage.jpg',
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
    heroImg: 'assets/images/after-makeover-2car-garage.jpg',
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

    // Keep static hero banner consistent with 'Blog Details' and blog-detail-hero.jpg
    const breadcrumbActive = document.querySelector('.inner-hero .breadcrumb-active');
    if (breadcrumbActive) breadcrumbActive.textContent = 'Blog Details';
    const heroDesc = document.querySelector('.inner-hero .inner-hero-desc');
    if (heroDesc && article.summary) {
      heroDesc.textContent = article.summary;
    }

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
    heroImg: 'assets/images/home-feat-cabinets.jpg',
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
    heroImg: 'assets/images/service-3-workbench.jpg',
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
    heroImg: 'assets/images/tool-organizer-slatwall.jpg',
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
    heroImg: 'assets/images/home-feat-overhead.jpg',
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
    heroImg: 'assets/images/service-6-sports.jpg',
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
    heroImg: 'assets/images/residential-seasonal-storage.jpg',
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
    heroImg: 'assets/images/after-makeover-2car-garage.jpg',
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
    heroImg: 'assets/images/about-mission.jpg',
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
    heroImg: 'assets/images/residential-garage-decluttering.jpg',
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
  },
  'flooring': {
    title: 'Polyaspartic Floor Coating Systems',
    tag: 'Commercial Floor Finishing',
    heroImg: 'assets/images/service-10-flooring.jpg',
    mainImg: 'assets/images/service-10-flooring.jpg',
    desc: 'Commercial-grade 4-layer polyaspartic and epoxy flake finishes engineered for extreme durability, chemical resistance, and showroom aesthetics. 4x stronger than standard DIY epoxy with rapid 1-day cure times and industrial UV resistance.',
    bullets: [
      'Multi-pass diamond grind concrete profiling ensuring optimal substrate adhesion',
      '100% solids polyaspartic topcoat impervious to motor oil, road salt, and brake fluid',
      'Slip-resistant textured vinyl flake matrix for secure traction in all weather conditions',
      'Zero hot-tire pickup rating backed by industrial chemical cure chemistry'
    ],
    features: [
      { icon: 'fa-brush', title: 'Industrial Chemistry', text: '4x more tensile strength than standard store-bought DIY epoxy systems.' },
      { icon: 'fa-clock', title: '1-Day Fast Cure', text: 'Walk on it in 6 hours; return vehicles to the garage within 24 hours.' },
      { icon: 'fa-droplet-slash', title: 'Stain & Salt Proof', text: 'Seamless non-porous finish wipes clean with simple water and mild soap.' }
    ]
  },
  'motorized': {
    title: 'Motorized Ceiling Storage Lifts',
    tag: 'Electric Overhead Platform',
    heroImg: 'assets/images/service-11-motorized.jpg',
    mainImg: 'assets/images/service-11-motorized.jpg',
    desc: 'Heavy-duty electric motorized platforms that lower to floor level with a wall switch or smartphone app, eliminating ladder climbing entirely. Supports up to 600 lbs of heavy cargo safely and stores it securely above vehicle rooflines.',
    bullets: [
      'Precision high-torque electric motor hoist wired with integrated safety brakes',
      'Aircraft-grade braided steel cables with redundant multi-point ceiling anchoring',
      'Adjustable auto-stop limit switches calibrated to your exact ceiling and floor heights',
      'Effortless push-button or smartphone app lowering for kayaks, rooftop boxes, and bins'
    ],
    features: [
      { icon: 'fa-gear', title: 'Electric Push-Button', text: 'Lower heavy bins and bulky gear directly to waist height without ladders.' },
      { icon: 'fa-shield-halved', title: 'Mechanical Locks', text: 'Automatic safety catch system prevents accidental drop or cable slippage.' },
      { icon: 'fa-car-side', title: 'Safe SUV Clearance', text: 'Stores flush to ceiling joists leaving full height for tall vehicles below.' }
    ]
  },
  'garden': {
    title: 'Lawn & Garden Tool Stations',
    tag: 'Outdoor Equipment Wall Matrix',
    heroImg: 'assets/images/service-12-garden.jpg',
    mainImg: 'assets/images/service-12-garden.jpg',
    desc: 'Dedicated wall-track and heavy-duty slatwall systems specifically configured to organize string trimmers, blowers, shovels, hoses, and mowers off the floor with specialized non-scratch brackets and modular accessories.',
    bullets: [
      'Industrial powder-coated vertical track and slatwall panels rated for 75 lbs per linear foot',
      'Rubberized double-cradle hooks specifically molded for trimmers, edgers, and blowers',
      'Heavy-duty wall-mounted auto-rewind garden hose and extension cord reels',
      'Clear floor zone parking bays calibrated for walk-behind mowers and wheelbarrows'
    ],
    features: [
      { icon: 'fa-seedling', title: 'Yard Gear Dedicated', text: 'Keep messy lawn equipment off concrete floors and safely accessible.' },
      { icon: 'fa-wrench', title: 'Tool-Specific Hooks', text: 'Cradles long handles, electric powerheads, and leaf blowers securely.' },
      { icon: 'fa-recycle', title: 'Easy Maintenance', text: 'Waterproof PVC slatwall cleans easily after muddy lawn care sessions.' }
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
  'transformations': 'complete',
  'polyaspartic': 'flooring',
  'floor-coating': 'flooring',
  'floors': 'flooring',
  'epoxy': 'flooring',
  'ceiling-lift': 'motorized',
  'motorized-lift': 'motorized',
  'hoist': 'motorized',
  'garden-tools': 'garden',
  'lawn-care': 'garden',
  'yard-tools': 'garden'
};

function initServiceDetails() {
  const serviceDetailContainer = document.getElementById('serviceDetailContainer');
  const serviceNavItems = document.querySelectorAll('.service-nav-item');

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
    const paramKey = urlParams.get('service');
    if (paramKey) return resolveServiceKey(paramKey);
    const hashKey = window.location.hash ? window.location.hash.replace('#', '') : null;
    if (hashKey) return resolveServiceKey(hashKey);
    return null;
  }

  // Handle services.html direct card anchor/parameter navigation
  if (!serviceDetailContainer) {
    const requestedService = getServiceFromUrl();
    if (requestedService) {
      const targetCard = document.getElementById(`service-${requestedService}`) || document.getElementById(requestedService);
      if (targetCard) {
        setTimeout(() => {
          targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
      }
    }
    return;
  }

  function renderService(key, shouldScroll = false) {
    const canonicalKey = resolveServiceKey(key || 'shelving');
    const data = serviceDatabase[canonicalKey] || serviceDatabase['shelving'];

    // Update document title
    document.title = `${data.title} — GarageOrg Services`;

    // Keep static hero banner consistent with 'Service Details' and service-detail-hero.jpg
    const breadcrumbActive = document.querySelector('.inner-hero .breadcrumb-active');
    if (breadcrumbActive) breadcrumbActive.textContent = 'Service Details';
    const heroDesc = document.querySelector('.inner-hero .inner-hero-desc');
    if (heroDesc && data) {
      heroDesc.textContent = `Explore structural load ratings, materials, and custom installation layouts for ${data.title.toLowerCase()}.`;
    }

    // Update active nav button and accessibility attributes
    serviceNavItems.forEach(item => {
      const itemKey = resolveServiceKey(item.getAttribute('data-service'));
      const isMatch = (itemKey === canonicalKey);
      if (isMatch) {
        item.classList.add('active');
        item.setAttribute('aria-selected', 'true');
      } else {
        item.classList.remove('active');
        item.setAttribute('aria-selected', 'false');
      }
    });

    // Render detail content
    serviceDetailContainer.innerHTML = `
      <div class="custom-card mb-4" id="activeServiceDetailCard">
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
                <i class="fas fa-check-circle mt-1" style="color: var(--brand-accent)"></i>
                <span>${b}</span>
              </li>
            `).join('')}
          </ul>

          <div class="row g-3 my-4">
            ${data.features.map(f => `
              <div class="col-md-4">
                <div class="p-3 rounded border h-100" style="background-color: var(--bg-surface); border-color: var(--border-color);">
                  <i class="fas ${f.icon} mb-2" style="font-size: 1.4rem; color: var(--brand-accent)"></i>
                  <h5 class="h6 mb-1">${f.title}</h5>
                  <p class="small mb-0 text-muted">${f.text}</p>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="p-4 rounded border mt-4 text-center" style="background-color: var(--bg-surface); border-color: var(--border-color);">
            <h4 class="mb-2">Ready to implement this solution in your garage?</h4>
            <p class="mb-3 text-muted">Schedule a free space planning consultation with our storage specialists.</p>
            <a href="contact.html?service=${encodeURIComponent(canonicalKey)}" class="btn btn-primary btn-lg">
              <i class="fas fa-calendar-check me-2"></i> Book a Consultation
            </a>
          </div>
        </div>
      </div>
    `;

    // Responsive scroll handling: make sure user sees the updated content on all screen sizes
    if (shouldScroll) {
      if (window.innerWidth < 992) {
        serviceDetailContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        const yOffset = -90;
        const y = serviceDetailContainer.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      }
    }
  }

  // Initial render based on URL param or hash
  const initialKey = getServiceFromUrl() || 'shelving';
  renderService(initialKey, false);

  // Click & keyboard listeners for sidebar nav
  serviceNavItems.forEach(item => {
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');

    function selectService() {
      const serviceKey = item.getAttribute('data-service');
      const canonicalKey = resolveServiceKey(serviceKey);
      renderService(canonicalKey, true);
      window.history.pushState({ service: canonicalKey }, '', `service-details.html?service=${canonicalKey}`);
    }

    item.addEventListener('click', (e) => {
      e.preventDefault();
      selectService();
    });

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectService();
      }
    });
  });

  // Popstate listener for back/forward navigation
  window.addEventListener('popstate', (e) => {
    const key = (e.state && e.state.service) ? e.state.service : getServiceFromUrl();
    renderService(key, false);
  });
}

/* ==========================================================================
   6. CONTACT FORM VALIDATION & VERIFICATION
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('consultationContactForm');
  const alertBox = document.getElementById('contactFormFeedback');

  if (!contactForm || !alertBox) return;

  const nameInput = contactForm.querySelector('#contactName');
  const emailInput = contactForm.querySelector('#contactEmail');
  const phoneInput = contactForm.querySelector('#contactPhone');
  const serviceInput = contactForm.querySelector('#contactService');
  const messageInput = contactForm.querySelector('#contactMessage');
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const phoneError = document.getElementById('phoneError');
  const serviceError = document.getElementById('serviceError');
  const messageError = document.getElementById('messageError');

  let feedbackTimer = null;

  // Optional URL parameter pre-selection if user navigated from a specific service page
  const urlParams = new URLSearchParams(window.location.search);
  const serviceParam = urlParams.get('service');
  if (serviceParam && serviceInput && !serviceInput.value) {
    const matchingOpt = Array.from(serviceInput.options).find(opt =>
      opt.value === serviceParam || opt.value.toLowerCase() === serviceParam.toLowerCase()
    );
    if (matchingOpt) {
      serviceInput.value = matchingOpt.value;
    }
  }

  // Keyboard shortcut: Ctrl+Enter or Cmd+Enter in textarea submits consultation form
  if (messageInput) {
    messageInput.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        contactForm.requestSubmit();
      }
    });
  }

  // 1. Full Name field typing restriction: strictly accepts name characters only, must NOT accept numbers
  if (nameInput) {
    nameInput.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'Enter', 'Escape'].includes(e.key)) {
        return;
      }
      // Strictly reject numbers 0-9
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        nameInput.classList.add('is-invalid');
        if (nameError) nameError.textContent = 'Numbers are not allowed in the full name field.';
        return;
      }
      // Strictly reject symbols and disallowed characters (only allow letters, spaces, hyphens, apostrophes, and dots)
      if (e.key.length === 1 && !/^[\p{L}\s'\u2019\-.]+$/u.test(e.key)) {
        e.preventDefault();
        nameInput.classList.add('is-invalid');
        if (nameError) nameError.textContent = 'Only letters, spaces, hyphens, and apostrophes are allowed.';
        return;
      }
    });

    nameInput.addEventListener('input', () => {
      // Strip any numbers if pasted or entered via autofill
      if (/\d/.test(nameInput.value)) {
        const start = nameInput.selectionStart;
        nameInput.value = nameInput.value.replace(/\d/g, '');
        if (start !== null) {
          const newPos = Math.min(start, nameInput.value.length);
          nameInput.setSelectionRange(newPos, newPos);
        }
        nameInput.classList.add('is-invalid');
        if (nameError) nameError.textContent = 'Numbers are not allowed in the full name field.';
      }
    });
  }

  // 2. Phone field typing restriction: strictly accepts numbers only, must NOT accept letters
  if (phoneInput) {
    phoneInput.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'Enter', 'Escape'].includes(e.key)) {
        return;
      }
      // Strictly reject letters a-z and A-Z
      if (/^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault();
        phoneInput.classList.add('is-invalid');
        if (phoneError) phoneError.textContent = 'Letters are not allowed in the phone number field.';
        return;
      }
      // Strictly reject symbols other than valid phone formatting (+, -, space, parentheses)
      if (e.key.length === 1 && !/^[0-9+\s\-().]$/.test(e.key)) {
        e.preventDefault();
        phoneInput.classList.add('is-invalid');
        if (phoneError) phoneError.textContent = 'Only numbers and standard phone symbols (+, -, parentheses) are allowed.';
        return;
      }
    });

    phoneInput.addEventListener('input', () => {
      // Strip any letters or disallowed characters if pasted or entered via autofill
      if (/[a-zA-Z]/.test(phoneInput.value) || /[^0-9+\s\-().]/.test(phoneInput.value)) {
        const start = phoneInput.selectionStart;
        phoneInput.value = phoneInput.value.replace(/[a-zA-Z]/g, '').replace(/[^0-9+\s\-().]/g, '');
        if (start !== null) {
          const newPos = Math.min(start, phoneInput.value.length);
          phoneInput.setSelectionRange(newPos, newPos);
        }
        phoneInput.classList.add('is-invalid');
        if (phoneError) phoneError.textContent = 'Letters are not allowed in the phone number field.';
      }
    });
  }

  // Real-time error clearing as user types or changes input
  [nameInput, emailInput, phoneInput, serviceInput, messageInput].forEach(field => {
    if (!field) return;
    const events = ['input', 'change'];
    events.forEach(evt => {
      field.addEventListener(evt, () => {
        if (field.classList.contains('is-invalid')) {
          field.classList.remove('is-invalid');
        }
        if (alertBox.classList.contains('alert-warning')) {
          alertBox.style.setProperty('display', 'none', 'important');
          alertBox.className = 'form-feedback-alert hide';
          alertBox.innerHTML = '';
        }
      });
    });
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Clear any existing timer from previous submissions
    if (feedbackTimer) {
      clearTimeout(feedbackTimer);
      feedbackTimer = null;
    }

    // Reset previous validation state
    [nameInput, emailInput, phoneInput, serviceInput, messageInput].forEach(field => {
      if (field) {
        field.classList.remove('is-invalid', 'is-valid');
      }
    });

    let isValid = true;
    let firstErrorMessage = '';
    let firstInvalidField = null;

    // Helper to flag an invalid field
    function markInvalid(field, errorEl, msg) {
      isValid = false;
      if (field) field.classList.add('is-invalid');
      if (errorEl) errorEl.textContent = msg;
      if (!firstErrorMessage) firstErrorMessage = msg;
      if (!firstInvalidField) firstInvalidField = field;
    }

    // Helper to flag a valid field
    function markValid(field) {
      if (field) field.classList.add('is-valid');
    }

    // 1. Full Name Validation
    const nameVal = nameInput ? nameInput.value.trim() : '';
    if (!nameVal) {
      markInvalid(nameInput, nameError, 'Please enter your full name.');
    } else if (nameVal.length < 2) {
      markInvalid(nameInput, nameError, 'Full name must be at least 2 characters.');
    } else if (/^\d+$/.test(nameVal.replace(/\s+/g, ''))) {
      markInvalid(nameInput, nameError, 'Full name cannot consist only of numbers.');
    } else if (/\d/.test(nameVal)) {
      markInvalid(nameInput, nameError, 'Full name cannot contain numbers.');
    } else if (!/^[\p{L}\s'\u2019\-.]+$/u.test(nameVal)) {
      markInvalid(nameInput, nameError, 'Full name contains invalid characters. Please use letters, spaces, hyphens, or apostrophes.');
    } else if (!/[\p{L}]/u.test(nameVal)) {
      markInvalid(nameInput, nameError, 'Full name must contain letters.');
    } else {
      markValid(nameInput);
    }

    // 2. Email Address Validation
    const emailVal = emailInput ? emailInput.value.trim() : '';
    if (!emailVal) {
      markInvalid(emailInput, emailError, 'Please enter your email address.');
    } else if (!validateEmail(emailVal)) {
      markInvalid(emailInput, emailError, 'Please enter a valid email address (e.g. name@example.com).');
    } else {
      markValid(emailInput);
    }

    // 3. Phone Number Validation (Optional field)
    const phoneVal = phoneInput ? phoneInput.value.trim() : '';
    if (phoneVal) {
      if (/[a-zA-Z]/.test(phoneVal)) {
        markInvalid(phoneInput, phoneError, 'Phone number cannot contain letters.');
      } else if (!/^\+?[0-9\s\-().]+$/.test(phoneVal)) {
        markInvalid(phoneInput, phoneError, 'Please enter a valid phone number containing digits and standard formatting symbols only.');
      } else {
        const digitsOnly = phoneVal.replace(/\D/g, '');
        if (digitsOnly.length < 7 || digitsOnly.length > 15) {
          markInvalid(phoneInput, phoneError, 'Please enter a valid phone number (between 7 and 15 digits).');
        } else {
          // Check balanced parentheses if present
          const openParens = (phoneVal.match(/\(/g) || []).length;
          const closeParens = (phoneVal.match(/\)/g) || []).length;
          if (openParens !== closeParens || openParens > 1 || (openParens === 1 && phoneVal.indexOf('(') > phoneVal.indexOf(')'))) {
            markInvalid(phoneInput, phoneError, 'Please enter a valid phone number with properly formatted parentheses.');
          } else {
            markValid(phoneInput);
          }
        }
      }
    } else {
      // Optional field: empty is valid
      if (phoneError) phoneError.textContent = '';
      if (phoneInput) phoneInput.classList.remove('is-invalid');
    }

    // 4. Primary Service Interest Validation
    const serviceVal = serviceInput ? serviceInput.value.trim() : '';
    if (!serviceVal) {
      markInvalid(serviceInput, serviceError, 'Please select a primary storage service.');
    } else {
      markValid(serviceInput);
    }

    // 5. Message / Garage Dimensions Validation
    const msgVal = messageInput ? messageInput.value.trim() : '';
    if (!msgVal) {
      markInvalid(messageInput, messageError, 'Please describe your garage size or storage goals.');
    } else {
      markValid(messageInput);
    }

    // Prevent submission and show visible accessible error alert
    if (!isValid) {
      alertBox.className = 'form-feedback-alert show alert alert-warning';
      alertBox.innerHTML = `
        <i class="fas fa-exclamation-triangle mt-1"></i>
        <div>
          <strong>Please correct the following:</strong>
          <p class="mb-0 small">${firstErrorMessage}</p>
        </div>
      `;
      alertBox.style.setProperty('display', 'flex', 'important');
      if (firstInvalidField) {
        firstInvalidField.focus();
      }
      return;
    }

    // Success feedback
    const selectedServiceText = (serviceInput && serviceInput.options[serviceInput.selectedIndex])
      ? serviceInput.options[serviceInput.selectedIndex].text
      : 'Selected Service';
    const submittedName = nameVal;

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

    // Clean validation classes on form reset
    [nameInput, emailInput, phoneInput, serviceInput, messageInput].forEach(field => {
      if (field) field.classList.remove('is-valid', 'is-invalid');
    });

    // Automatically hide/remove success notification after 6 seconds
    feedbackTimer = setTimeout(() => {
      alertBox.style.setProperty('display', 'none', 'important');
      alertBox.style.display = 'none';
      alertBox.className = 'form-feedback-alert hide';
      alertBox.innerHTML = '';
      feedbackTimer = null;
    }, 6000);
  });
}

function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
  return re.test(trimmed);
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
