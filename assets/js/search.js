// Brighton Search - shared across all pages
(function(){

  const INDEX = [
    // ── Main Pages ──────────────────────────────────────────────────────────────
    { title:'Home',                   desc:'Brighton Lawn & Landscape - full-service landscaping NJ & PA', url:'index.html',                      tags:'home main brighton lawn landscape nj pa' },
    { title:'Residential Services',   desc:'Design, build, and maintain your dream outdoor space',         url:'residential.html',                tags:'residential design build maintain backyard home house' },
    { title:'Commercial Services',    desc:'Commercial lawn maintenance and installs',                      url:'commercial.html',                 tags:'commercial lawn maintenance property management hoa office' },
    { title:'Site Work',              desc:'Asphalt, concrete, drainage, land clearing, tree removal',     url:'sitework.html',                   tags:'site work asphalt concrete drainage land clearing tree removal grading excavation' },
    { title:'Snow & Ice Management',  desc:'Plowing, salting, sidewalk clearing - 24/7 storm response',   url:'snow.html',                       tags:'snow ice plowing salting storm winter division brighton snow' },
    { title:'Our Work / Portfolio',   desc:'Browse all completed projects',                                url:'work.html',                       tags:'portfolio work projects gallery completed photos' },
    { title:'Contact / Get a Quote',  desc:'Request a free estimate - call or email us',                  url:'index.html#contact',              tags:'contact quote estimate call email phone reach' },
    { title:'About Us',               desc:'Meet the Brighton Lawn & Landscape team',                      url:'index.html#about',                tags:'about team story brighton who we are' },

    // ── Commercial Services ──────────────────────────────────────────────────────
    { title:'Lawn Maintenance',       desc:'Weekly mowing, edging, blowing - commercial properties',       url:'commercial.html#lawn-maintenance', tags:'lawn mowing edging blowing fertilization weed commercial weekly' },
    { title:'Commercial Installs',    desc:'Sodding, trees, beds, hardscape & irrigation installs',        url:'commercial-installs.html',         tags:'commercial install sod turf tree shrub bed hardscape irrigation new construction' },
    { title:'Sodding & Turf Install', desc:'Commercial sod installation for all property sizes',           url:'commercial-installs.html#sod',     tags:'sod sodding turf grass lawn install roll' },
    { title:'Tree & Shrub Planting',  desc:'Specimen trees, privacy hedges, ornamental plantings',         url:'commercial-installs.html#trees',   tags:'tree shrub plant install commercial privacy hedge ornamental' },
    { title:'Landscape Beds',         desc:'New bed creation, plants, edging and mulch',                   url:'commercial-installs.html#beds',    tags:'beds landscape planting mulch edging flower bed' },
    { title:'Commercial Hardscape',   desc:'Pavers, walkways, walls, curbing for commercial properties',   url:'commercial-installs.html#hardscape',tags:'hardscape paver walkway wall curbing commercial retaining' },
    { title:'Irrigation Install',     desc:'Full irrigation system design and installation',               url:'commercial-installs.html#irrigation',tags:'irrigation sprinkler system install water heads zones' },

    // ── Snow & Ice ───────────────────────────────────────────────────────────────
    { title:'Snow Plowing',           desc:'Parking lots, driveways, roads - multi-pass storm coverage',  url:'snow.html#plowing',               tags:'plow plowing parking lot snow push stacking truck fleet' },
    { title:'Salting & De-Icing',     desc:'Pre-treatment, mid-storm and post-storm salting',             url:'snow.html#salting',               tags:'salt salting deicing ice treatment spreader bulk liquid brine' },
    { title:'Sidewalk Clearing',      desc:'50+ miles of sidewalk cleared every season',                  url:'snow.html#sidewalks',             tags:'sidewalk walkway snow shovel sand ADA entrance path clearing' },
    { title:'Pre-Storm Planning',     desc:'Client walkthroughs and crew briefings before every storm',   url:'snow.html#planning',              tags:'planning walkthrough meeting crew storm prep preparation' },
    { title:'Snow Contract',          desc:'Get under contract - seasonal snow coverage',                  url:'snow.html',                       tags:'contract seasonal snow agreement coverage winter pricing quote' },
    { title:'Snow Division',          desc:'Brighton Snow Division - dedicated snow & ice management',     url:'snow.html',                       tags:'snow division brighton dedicated fleet routes crews storm 24 7' },

    // ── Service Locations ────────────────────────────────────────────────────────
    // Ocean County
    { title:'Ocean County, NJ',       desc:'Snow plowing, lawn maintenance & landscaping in Ocean County', url:'snow.html',                      tags:'ocean county nj new jersey toms river brick lakewood jackson howell manchester berkeley township barnegat beachwood point pleasant manahawkin stafford' },
    { title:'Toms River, NJ',         desc:'Full landscaping and snow services in Toms River',             url:'snow.html',                      tags:'toms river ocean county nj snow plow lawn commercial' },
    { title:'Brick, NJ',              desc:'Landscaping and snow services in Brick Township',              url:'snow.html',                      tags:'brick brick township ocean county nj snow lawn' },
    { title:'Lakewood, NJ',           desc:'Commercial lawn and snow services in Lakewood',                url:'snow.html',                      tags:'lakewood ocean county nj commercial snow lawn hoa' },
    { title:'Jackson, NJ',            desc:'Landscaping and snow removal in Jackson Township',             url:'snow.html',                      tags:'jackson jackson township ocean county nj snow lawn' },
    { title:'Howell, NJ',             desc:'Landscaping and snow services in Howell',                     url:'snow.html',                      tags:'howell monmouth county nj snow lawn landscape' },
    { title:'Manchester, NJ',         desc:'Snow and landscape services in Manchester Township',           url:'snow.html',                      tags:'manchester ocean county nj snow lawn landscape' },
    // Monmouth County
    { title:'Monmouth County, NJ',    desc:'Snow plowing, lawn maintenance & landscaping in Monmouth County', url:'snow.html',                  tags:'monmouth county nj wall freehold marlboro manalapan aberdeen hazlet keyport colts neck holmdel middletown red bank long branch' },
    { title:'Wall, NJ',               desc:'Landscaping and snow removal in Wall Township',               url:'snow.html',                      tags:'wall township monmouth county nj snow lawn' },
    { title:'Freehold, NJ',           desc:'Commercial lawn and snow services in Freehold',               url:'snow.html',                      tags:'freehold monmouth county nj snow lawn commercial' },
    { title:'Marlboro, NJ',           desc:'Landscaping and snow in Marlboro Township',                   url:'snow.html',                      tags:'marlboro monmouth county nj snow lawn landscape' },
    // Middlesex County
    { title:'Middlesex County, NJ',   desc:'Snow and landscape services in Middlesex County',             url:'snow.html',                      tags:'middlesex county nj old bridge sayreville edison south brunswick monroe township piscataway perth amboy' },
    { title:'Old Bridge, NJ',         desc:'Snow plowing and landscaping in Old Bridge',                  url:'snow.html',                      tags:'old bridge middlesex county nj snow lawn landscape' },
    // Northeast Philly / PA
    { title:'Northeast Philadelphia', desc:'Snow plowing and landscape services in Northeast Philly',      url:'snow.html',                      tags:'northeast philly philadelphia fox chase mayfair tacony holmesburg torresdale pa pennsylvania' },
    { title:'Bensalem, PA',           desc:'Snow and landscape services in Bensalem',                     url:'snow.html',                      tags:'bensalem bucks county pa pennsylvania snow lawn landscape northeast philly' },
    { title:'Levittown, PA',          desc:'Snow and landscape services in Levittown',                     url:'snow.html',                      tags:'levittown bucks county pa pennsylvania snow lawn landscape' },
    { title:'Bristol, PA',            desc:'Snow and landscape services in Bristol',                       url:'snow.html',                      tags:'bristol bucks county pa pennsylvania snow lawn landscape' },

    // ── Industries ───────────────────────────────────────────────────────────────
    { title:'HOA Landscaping',        desc:'Lawn maintenance and snow for homeowner associations',         url:'commercial.html',                tags:'hoa homeowner association community property lawn snow maintenance' },
    { title:'Medical Facilities',     desc:'Snow and grounds maintenance for medical properties',          url:'snow.html',                      tags:'medical hospital clinic healthcare facility snow lawn maintenance' },
    { title:'Industrial Properties',  desc:'Snow plowing and grounds for industrial sites',               url:'snow.html',                      tags:'industrial warehouse facility snow plow lawn maintenance' },
    { title:'Educational Facilities', desc:'Snow removal and landscaping for schools',                     url:'snow.html',                      tags:'school educational college daycare university campus snow lawn' },
    { title:'Shopping Centers',       desc:'Parking lot plowing and grounds for shopping centers',        url:'snow.html',                      tags:'shopping center retail plaza strip mall parking lot snow plow lawn' },
    { title:'Office Complexes',       desc:'Snow and grounds maintenance for office parks',               url:'snow.html',                      tags:'office complex corporate park business snow lawn maintenance' },
    { title:'Multi-Family / Apartments', desc:'Snow and lawn maintenance for apartment communities',      url:'commercial.html',                tags:'multi family apartment complex residential community snow lawn maintenance' },
    { title:'Property Management',    desc:'Full grounds and snow services for property managers',        url:'commercial.html',                tags:'property management manager grounds snow lawn commercial contract' },

    // ── Site Work ────────────────────────────────────────────────────────────────
    { title:'Asphalt Repair',         desc:'Patching, pothole repair, small asphalt work',               url:'sitework.html#asphalt',           tags:'asphalt paving pothole patch repair parking lot driveway' },
    { title:'Concrete Work',          desc:'Concrete repairs, curbing, and finishing',                    url:'sitework.html#concrete',          tags:'concrete repair finishing curb sidewalk pour slab' },
    { title:'Drainage',               desc:'French drains, drainage pipe installation, water management', url:'sitework.html#drainage',          tags:'drainage french drain water pipe flood grading catch basin' },
    { title:'Land Clearing',          desc:'Lot clearing, grubbing, site prep, excavation',              url:'sitework.html#land-clearing',     tags:'land clearing lot grubbing site prep excavation demolish brush' },
    { title:'Tree Removal & Pruning', desc:'Tree removal, pruning, trimming, bucket truck service',      url:'sitework.html#tree-removal',      tags:'tree removal pruning trimming bucket truck stump grinding' },

    // ── Residential ─────────────────────────────────────────────────────────────
    { title:'Landscape Design',       desc:'Custom layout, materials, planting, and lighting plans',     url:'residential.html#design',         tags:'design landscape plan layout 3d render rendering concept' },
    { title:'Landscape Construction', desc:'Hardscaping, planting, turf, lighting installation',         url:'residential.html#build',          tags:'build construction hardscape paver patio retaining wall lighting turf install' },
    { title:'Landscape Maintenance',  desc:'Ongoing seasonal care - we maintain what we install',        url:'residential.html#maintain',       tags:'maintain maintenance seasonal residential cleanup spring fall' },

    // ── Projects ─────────────────────────────────────────────────────────────────
    { title:'The Scotch Way Project', desc:'Commercial - 17 homes fully landscaped, 200+ trees, sod',   url:'scotchway-project.html',          tags:'scotch way commercial development sod trees shrubs landscape beds install' },
    { title:'The Toras Aron Project', desc:'Commercial - full grounds revamp, mulch, pruning, planting', url:'toras-aron-project.html',         tags:'toras aron commercial playground revamp mulch pruning planting signage' },
    { title:'The Sukkah Project',     desc:'Residential - custom lattice arch with roses and flowers',   url:'sukkah-project.html',             tags:'sukkah arch floral roses residential project custom' },
    { title:'Corner Project',         desc:'Residential - full backyard transformation',                  url:'corner-project.html',             tags:'corner project patio paver backyard residential transformation' },
    { title:'Baker Project',          desc:'Residential - paver driveway and landscape install',         url:'baker-project.html',              tags:'baker project driveway paver residential install' },
    { title:'Beige Project',          desc:'Residential landscape project',                              url:'beige-project.html',              tags:'beige project residential landscape' },
    { title:'Bates Road',             desc:'Residential landscape project',                              url:'bates-road.html',                 tags:'bates road project residential landscape' },
    { title:'Arlington Project',      desc:'Residential landscape project',                              url:'arlington-project.html',          tags:'arlington project residential landscape' },
    { title:'Pool & Patio Project',   desc:'Pool surround and patio construction',                       url:'pool-patio.html',                 tags:'pool patio construction water feature surround hardscape' },
    { title:'Vanard Project',         desc:'Residential waterfront landscape project',                   url:'vanard-project.html',             tags:'vanard project residential waterfront landscape' },
  ];

  // ── Synonym map ──────────────────────────────────────────────────────────────
  const SYNONYMS = {
    // grass / lawn
    'grass':['lawn','mowing','maintenance','turf'], 'gras':['lawn','mowing'], 'grss':['lawn','grass'],
    'lown':['lawn','mowing'], 'laun':['lawn','mowing'], 'mow':['lawn','mowing','maintenance'],
    'mowing':['lawn','maintenance'], 'cut':['lawn','mowing'], 'cutting':['lawn','mowing'],
    'turf':['lawn','grass','maintenance'], 'weeds':['lawn','maintenance','weed'],
    'fertilize':['lawn','fertilization','maintenance'], 'fert':['lawn','fertilization'],
    'edging':['lawn','maintenance'], 'blowing':['lawn','maintenance'],

    // snow / winter / ice
    'snow':['snow','ice','plowing','salting','winter','storm'],
    'snoe':['snow','ice','plowing'], 'sno':['snow','ice','plowing'],
    'ice':['snow','ice','salting','deicing'], 'plow':['snow','plowing','ice'],
    'plowing':['snow','ice','parking'], 'salt':['snow','ice','salting'],
    'salting':['snow','ice','deicing'], 'winter':['snow','ice','plowing','seasonal'],
    'storm':['snow','ice','plowing','salting'], 'deice':['snow','salting','ice'],
    'deicing':['snow','salting'], 'brine':['snow','salting','liquid'],
    'sidewalk':['snow','sidewalk','clearing','shovel'], 'shovel':['snow','sidewalk'],
    'stakes':['snow','staking','markers'], 'staking':['snow','stakes'],
    'seasonal':['snow','contract','maintenance'], 'contract':['snow','seasonal','quote'],
    'routes':['snow','plowing'], 'fleet':['snow','plowing','truck'],
    'cleared':['snow','plowing','sidewalk'], 'slippery':['snow','ice','salting'],

    // locations - NJ
    'nj':['nj','new jersey','ocean','monmouth','middlesex'],
    'new jersey':['nj','ocean county','monmouth county','commercial','snow'],
    'jersey':['nj','new jersey'],
    'ocean':['ocean county','toms river','brick','lakewood','jackson'],
    'ocean county':['toms river','brick','lakewood','jackson','snow','lawn'],
    'toms river':['ocean county','nj','snow','lawn'],
    'tomsriver':['toms river','ocean county'],
    'brick':['brick','ocean county','nj','snow'],
    'lakewood':['lakewood','ocean county','nj','commercial','hoa','snow'],
    'jackson':['jackson','ocean county','nj','snow','lawn'],
    'howell':['howell','monmouth county','nj','snow','lawn'],
    'manchester':['manchester','ocean county','nj','snow'],
    'monmouth':['monmouth county','wall','freehold','marlboro','manalapan'],
    'monmouth county':['wall','freehold','marlboro','snow','lawn'],
    'wall':['wall','monmouth county','nj','snow'],
    'freehold':['freehold','monmouth county','nj','snow','lawn'],
    'marlboro':['marlboro','monmouth county','nj'],
    'manalapan':['manalapan','monmouth county','nj'],
    'middlesex':['middlesex county','old bridge','sayreville','edison'],
    'middlesex county':['old bridge','sayreville','snow','lawn'],
    'old bridge':['old bridge','middlesex county','nj'],
    'sayreville':['sayreville','middlesex county','nj'],
    'edison':['edison','middlesex county','nj'],

    // locations - PA / Philly
    'pa':['pennsylvania','philly','philadelphia','bensalem','levittown'],
    'pennsylvania':['pa','philly','northeast philadelphia','bensalem'],
    'philly':['philadelphia','northeast philadelphia','pa','snow'],
    'philadelphia':['northeast philadelphia','philly','pa','snow'],
    'northeast':['northeast philadelphia','fox chase','mayfair','bensalem'],
    'fox chase':['northeast philadelphia','philly','pa'],
    'mayfair':['northeast philadelphia','philly','pa'],
    'tacony':['northeast philadelphia','philly','pa'],
    'bensalem':['bensalem','bucks county','pa','snow'],
    'levittown':['levittown','bucks county','pa','snow'],
    'bristol':['bristol','bucks county','pa','snow'],
    'bucks':['bucks county','bensalem','levittown','bristol','pa'],

    // industries
    'hoa':['hoa','homeowner','association','commercial','lawn','snow'],
    'homeowner':['hoa','residential','commercial'],
    'medical':['medical','hospital','healthcare','snow','lawn'],
    'hospital':['medical','healthcare','snow','lawn'],
    'clinic':['medical','healthcare','snow'],
    'industrial':['industrial','warehouse','commercial','snow','lawn'],
    'warehouse':['industrial','commercial','snow'],
    'school':['educational','school','campus','snow','lawn'],
    'schools':['educational','school','snow'],
    'educational':['school','campus','educational','snow'],
    'college':['educational','campus','snow'],
    'shopping':['shopping center','retail','commercial','snow','plow'],
    'retail':['shopping center','commercial','snow'],
    'office':['office complex','commercial','snow','lawn'],
    'apartment':['multi family','residential','commercial','snow','lawn'],
    'apartments':['multi family','commercial','snow'],
    'property management':['commercial','property','contract','snow','lawn'],
    'manager':['property management','commercial'],

    // hardscape / patio
    'patio':['patio','paver','hardscape','construction'],
    'pavers':['patio','paver','hardscape'], 'paver':['patio','hardscape'],
    'hardscape':['patio','paver','construction','retaining','wall'],
    'stone':['patio','paver','hardscape'], 'brick':['patio','paver','hardscape'],
    'walkway':['patio','paver','hardscape'], 'driveway':['asphalt','concrete','paver'],
    'retaining':['hardscape','wall','retaining wall'], 'wall':['hardscape','retaining'],
    'steps':['hardscape','paver','construction'], 'staircase':['hardscape','paver'],

    // pool
    'pool':['pool','patio','water','construction'], 'swimming':['pool','patio'],

    // trees / plants
    'tree':['tree','removal','pruning','trimming'], 'trees':['tree','removal','pruning'],
    'trim':['tree','pruning','trimming'], 'trimming':['tree','pruning'],
    'prune':['tree','pruning'], 'pruning':['tree','trimming'],
    'stump':['tree','removal','grinding'], 'bush':['tree','shrub','pruning'],
    'shrub':['tree','shrub','pruning','trimming'], 'plant':['design','maintain','construction'],
    'planting':['design','construction','beds'], 'flower':['design','beds','planting'],
    'mulch':['beds','maintain','landscape'], 'mulching':['beds','maintain'],

    // drainage
    'drain':['drainage','french','pipe','water'], 'drainage':['french drain','water','pipe'],
    'french drain':['drainage','water','flooding'], 'flood':['drainage','french'],
    'flooding':['drainage','french drain'], 'water':['drainage','irrigation','pool'],
    'catch basin':['drainage','water'],

    // asphalt / concrete
    'asphalt':['asphalt','paving','repair'], 'paving':['asphalt','concrete'],
    'pothole':['asphalt','repair'], 'pavement':['asphalt','concrete'],
    'concrete':['concrete','repair','curb'], 'curb':['concrete','asphalt'],

    // land clearing
    'clear':['land clearing','clearing'], 'clearing':['land clearing','lot'],
    'lot':['land clearing','clearing'], 'grading':['land clearing','site work'],
    'excavation':['land clearing','site work','grading'],
    'demolish':['land clearing','site work'],

    // design / build
    'design':['design','layout','plan','render'], 'blueprint':['design','plan'],
    'render':['design','3d','plan'], 'build':['construction','build'],
    'install':['construction','build','installs','commercial'],
    'sod':['sod','turf','grass','install'], 'sodding':['sod','turf','install'],
    'irrigation':['irrigation','sprinkler','water','install'],
    'sprinkler':['irrigation','water'], 'landscape':['design','construction','residential'],
    'landscaping':['design','construction','residential'],
    'backyard':['residential','design','build','patio'],
    'yard':['residential','lawn','design'], 'garden':['design','residential','planting'],

    // maintain
    'maintain':['maintain','maintenance','lawn'], 'maintenance':['lawn','maintain'],
    'cleanup':['maintain','spring','fall'], 'spring':['maintain','cleanup','lawn'],
    'fall':['maintain','cleanup','lawn'], 'seasonal':['maintain','snow','contract'],

    // contact
    'quote':['contact','quote','estimate'], 'estimate':['contact','quote'],
    'price':['contact','quote'], 'cost':['contact','quote'],
    'call':['contact','call'], 'contact':['contact','call'],
    'phone':['contact','call'], 'email':['contact','email'],

    // Brighton
    'brighton':['brighton','lawn','landscape','snow division'],
    'snow division':['snow','brighton','division','plowing'],
  };

  // ── Levenshtein distance ─────────────────────────────────────────────────────
  function editDist(a,b){
    if(a===b) return 0; if(!a.length) return b.length; if(!b.length) return a.length;
    const dp=Array.from({length:a.length+1},(_,i)=>[i]);
    for(let j=1;j<=b.length;j++) dp[0][j]=j;
    for(let i=1;i<=a.length;i++) for(let j=1;j<=b.length;j++)
      dp[i][j]=a[i-1]===b[j-1]?dp[i-1][j-1]:1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1]);
    return dp[a.length][b.length];
  }

  function expandTerm(term){
    const expanded=new Set([term]);
    if(SYNONYMS[term]) SYNONYMS[term].forEach(s=>expanded.add(s));
    if(term.length>=4){
      for(const key of Object.keys(SYNONYMS)){
        if(key.length>=3){
          const maxDist=term.length<=5?1:2;
          if(editDist(term,key)<=maxDist){ expanded.add(key); SYNONYMS[key].forEach(s=>expanded.add(s)); }
        }
      }
    }
    return [...expanded];
  }

  function score(item,q){
    const rawTerms=q.toLowerCase().trim().split(/\s+/);
    const haystack=(item.title+' '+item.desc+' '+item.tags).toLowerCase();
    let s=0;
    for(const raw of rawTerms){
      if(!raw) continue;
      const terms=expandTerm(raw);
      for(const t of terms){
        if(item.title.toLowerCase().includes(t)){s+=10;break;}
        else if(haystack.includes(t)){s+=3;break;}
      }
    }
    return s;
  }

  function search(q){
    if(!q.trim()) return [];
    return INDEX.map(item=>({item,s:score(item,q)})).filter(x=>x.s>0)
      .sort((a,b)=>b.s-a.s).map(x=>x.item).slice(0,10);
  }

  // ── Overlay HTML ─────────────────────────────────────────────────────────────
  const overlay=document.createElement('div');
  overlay.id='search-overlay';
  overlay.innerHTML=`
    <div id="search-box">
      <div id="search-input-wrap">
        <svg id="search-icon-inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input id="search-input" type="text" placeholder="Search services, locations, projects…" autocomplete="off" spellcheck="false">
        <button id="search-close" aria-label="Close search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div id="search-results"></div>
      <div id="search-hints">
        <span>Try:</span>
        <a href="#" data-q="snow removal">Snow removal</a>
        <a href="#" data-q="Lakewood">Lakewood</a>
        <a href="#" data-q="lawn maintenance">Lawn maintenance</a>
        <a href="#" data-q="Ocean County">Ocean County</a>
        <a href="#" data-q="patio">Patio</a>
        <a href="#" data-q="tree removal">Tree removal</a>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  // ── CSS ──────────────────────────────────────────────────────────────────────
  const style=document.createElement('style');
  style.textContent=`
    .search-trigger{display:flex;align-items:center;justify-content:center;background:none;border:none;cursor:pointer;padding:6px;color:#fff;opacity:.9;transition:opacity .2s,color .2s;}
    header.solid .search-trigger{color:var(--heading,#1a2e1a);}
    .search-trigger:hover{opacity:1;color:var(--green-light,#52a03c);}
    .search-trigger svg{width:19px;height:19px;}
    #search-overlay{display:none;position:fixed;inset:0;z-index:2000;background:rgba(4,8,4,.82);backdrop-filter:blur(12px);align-items:flex-start;justify-content:center;padding-top:80px;}
    #search-overlay.open{display:flex;}
    #search-box{width:100%;max-width:660px;margin:0 20px;background:#fff;border-radius:20px;box-shadow:0 32px 80px rgba(0,0,0,.32);overflow:hidden;}
    #search-input-wrap{display:flex;align-items:center;gap:12px;padding:18px 20px;border-bottom:1px solid #e8ede8;}
    #search-icon-inline{width:20px;height:20px;color:#7a9a7a;flex-shrink:0;}
    #search-input{flex:1;border:none;outline:none;font-size:18px;font-family:inherit;color:#1a2e1a;background:transparent;}
    #search-input::placeholder{color:#a0b8a0;}
    #search-close{background:none;border:none;cursor:pointer;padding:4px;color:#7a9a7a;display:flex;align-items:center;}
    #search-close:hover{color:#1a2e1a;}
    #search-close svg{width:20px;height:20px;}
    #search-results{max-height:420px;overflow-y:auto;}
    .sr-item{display:flex;align-items:center;gap:14px;padding:13px 20px;text-decoration:none;color:inherit;transition:background .15s;}
    .sr-item:hover{background:#f2f7f2;}
    .sr-item+.sr-item{border-top:1px solid #f0f5f0;}
    .sr-icon{width:36px;height:36px;border-radius:10px;background:#e6f0e6;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
    .sr-icon svg{width:17px;height:17px;color:#2a6e3f;}
    .sr-title{font-size:15px;font-weight:600;color:#1a2e1a;}
    .sr-desc{font-size:13px;color:#6a8a6a;margin-top:1px;}
    .sr-empty{padding:28px 20px;text-align:center;color:#8aaa8a;font-size:15px;}
    #search-hints{padding:14px 20px;border-top:1px solid #edf3ed;display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
    #search-hints span{font-size:12px;color:#9aaa9a;font-weight:600;text-transform:uppercase;letter-spacing:1px;}
    #search-hints a{font-size:13px;color:#2a6e3f;text-decoration:none;background:#edf6ed;padding:4px 12px;border-radius:50px;transition:background .2s;}
    #search-hints a:hover{background:#d8edd8;}
  `;
  document.head.appendChild(style);

  // ── Scroll to hash ───────────────────────────────────────────────────────────
  function scrollToHash(){
    const hash=location.hash; if(!hash) return;
    const target=document.querySelector(hash); if(!target) return;
    requestAnimationFrame(()=>{
      const headerH=document.querySelector('header')?document.querySelector('header').offsetHeight:80;
      window.scrollTo({top:target.getBoundingClientRect().top+window.scrollY-headerH-24,behavior:'smooth'});
    });
  }
  if(document.readyState==='complete') scrollToHash();
  else window.addEventListener('load',scrollToHash);

  // ── Open / close ─────────────────────────────────────────────────────────────
  function openSearch(){overlay.classList.add('open');document.body.style.overflow='hidden';setTimeout(()=>document.getElementById('search-input').focus(),60);}
  function closeSearch(){overlay.classList.remove('open');document.body.style.overflow='';document.getElementById('search-input').value='';document.getElementById('search-results').innerHTML='';}
  document.getElementById('search-close').addEventListener('click',closeSearch);
  overlay.addEventListener('click',e=>{if(e.target===overlay)closeSearch();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSearch();});
  document.querySelectorAll('#search-hints a').forEach(a=>{
    a.addEventListener('click',e=>{e.preventDefault();const q=a.dataset.q;document.getElementById('search-input').value=q;renderResults(q);});
  });

  // ── Render ───────────────────────────────────────────────────────────────────
  const PAGE_ICON=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;
  const SVC_ICON=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>`;
  const PROJ_ICON=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M9 21V9"/></svg>`;
  const LOC_ICON=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
  const PROJ_URLS=['sukkah-project','corner-project','baker-project','beige-project','bates-road','arlington-project','pool-patio','vanard-project','scotchway-project','toras-aron-project'];
  const SVC_URLS=['commercial.html','residential.html','sitework.html','commercial-installs.html'];
  const LOC_TITLES=['County','Toms River','Brick','Lakewood','Jackson','Howell','Manchester','Wall','Freehold','Marlboro','Manalapan','Old Bridge','Sayreville','Edison','Philadelphia','Bensalem','Levittown','Bristol'];
  function iconFor(url,title){
    if(LOC_TITLES.some(l=>title.includes(l))) return LOC_ICON;
    if(PROJ_URLS.some(p=>url.includes(p))) return PROJ_ICON;
    if(SVC_URLS.some(s=>url===s||url.startsWith(s.replace('.html','')))) return SVC_ICON;
    return PAGE_ICON;
  }

  function renderResults(q){
    const res=search(q);
    const el=document.getElementById('search-results');
    if(!q.trim()){el.innerHTML='';return;}
    if(!res.length){el.innerHTML=`<div class="sr-empty">No results for "<strong>${q}</strong>" - try a different term.</div>`;return;}
    el.innerHTML=res.map(r=>`
      <a class="sr-item" href="${r.url}">
        <div class="sr-icon">${iconFor(r.url,r.title)}</div>
        <div><div class="sr-title">${r.title}</div><div class="sr-desc">${r.desc}</div></div>
      </a>`).join('');
    el.querySelectorAll('.sr-item').forEach(a=>a.addEventListener('click',()=>closeSearch()));
  }

  document.getElementById('search-input').addEventListener('input',e=>renderResults(e.target.value));
  document.getElementById('search-input').addEventListener('keydown',e=>{
    if(e.key==='Enter'){const first=document.querySelector('.sr-item');if(first){closeSearch();location.href=first.href;}}
  });

  // ── Inject trigger ───────────────────────────────────────────────────────────
  document.querySelectorAll('.nav').forEach(nav=>{
    const btn=document.createElement('button');
    btn.className='search-trigger';btn.setAttribute('aria-label','Search');
    btn.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;
    btn.addEventListener('click',openSearch);
    const quoteBtn=nav.querySelector('.nav-btn');
    if(quoteBtn) nav.insertBefore(btn,quoteBtn); else nav.appendChild(btn);
  });

})();
