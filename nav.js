const pages=[['home','index.html','Home','Accueil'],['career','career.html','Career','Carrière'],['mobility','mobility.html','International Mobility','Mobilité internationale'],['activities','activities.html','Activities','Activités'],['contact','contact.html','Contact','Contact']];

function buildNav(active='home'){
  return `<nav class="nav"><div class="nav-inner"><a class="brand" href="index.html">Naïl Fariss</a><div class="links">${pages.map(p=>`<a class="${active===p[0]?'active':''}" href="${p[1]}" data-en="${p[2]}" data-fr="${p[3]}" ${p[0]==='contact'?'data-contact-trigger="true"':''}>${p[2]}</a>`).join('')}<div class="lang"><button onclick="setLang('fr')" id="frBtn">FR</button><button onclick="setLang('en')" id="enBtn">EN</button></div></div></div></nav>`
}

function setLang(lang){
  sessionStorage.setItem('lang',lang);
  document.documentElement.lang=lang;
  document.querySelectorAll('[data-fr][data-en]').forEach(el=>{el.innerHTML=el.dataset[lang]});
  document.getElementById('frBtn')?.classList.toggle('active',lang==='fr');
  document.getElementById('enBtn')?.classList.toggle('active',lang==='en');
  document.querySelectorAll('[data-lang-placeholder]').forEach(el=>{el.placeholder=el.dataset[lang==='fr'?'frPlaceholder':'enPlaceholder']});
}

function initLang(){setLang(sessionStorage.getItem('lang')||'en')}

function injectContactModal(){
  if(document.getElementById('contactModal')) return;
  const modal=document.createElement('div');
  modal.id='contactModal';
  modal.className='contact-modal';
  modal.setAttribute('aria-hidden','true');
  modal.innerHTML=`
    <div class="contact-overlay" data-contact-close></div>
    <section class="contact-modal-card" role="dialog" aria-modal="true" aria-labelledby="contactModalTitle">
      <button class="contact-close" type="button" aria-label="Close" data-contact-close>×</button>
      <div class="contact-modal-kicker" data-fr="CONTACT" data-en="CONTACT">CONTACT</div>
      <h2 id="contactModalTitle" data-fr="Parlons de votre projet." data-en="Let's talk about your project.">Let's talk about your project.</h2>
      <p class="contact-modal-intro" data-fr="Une opportunité de stage, un projet ou simplement une question ? Envoyez-moi un message." data-en="An internship opportunity, a project, or simply a question? Send me a message.">An internship opportunity, a project, or simply a question? Send me a message.</p>
      <form id="contactForm" action="https://formsubmit.co/nailfariss1@gmail.com" method="POST" target="contactSubmitFrame">
        <input type="hidden" name="_subject" value="New contact from Naïl Fariss portfolio">
        <input type="hidden" name="_template" value="table">
        <input type="hidden" name="_captcha" value="true">
        <div class="contact-form-grid">
          <label><span data-fr="Nom" data-en="Name">Name</span><input required name="name" type="text" autocomplete="name" data-lang-placeholder data-en-placeholder="Your name" data-fr-placeholder="Votre nom" placeholder="Your name"></label>
          <label><span data-fr="Email" data-en="Email">Email</span><input required name="email" type="email" autocomplete="email" data-lang-placeholder data-en-placeholder="your@email.com" data-fr-placeholder="votre@email.com" placeholder="your@email.com"></label>
        </div>
        <label><span data-fr="Message" data-en="Message">Message</span><textarea required name="message" rows="5" data-lang-placeholder data-en-placeholder="Write your message..." data-fr-placeholder="Écrivez votre message..." placeholder="Write your message..."></textarea></label>
        <div class="contact-form-actions">
          <button class="btn primary" type="submit"><span data-fr="Envoyer le message →" data-en="Send message →">Send message →</span></button>
          <span id="contactStatus" class="contact-status" role="status" aria-live="polite"></span>
        </div>
      </form>
      <p class="contact-direct"><span data-fr="Ou écrivez-moi directement à" data-en="Or email me directly at">Or email me directly at</span> <a href="mailto:nailfariss1@gmail.com">nailfariss1@gmail.com</a></p>
    </section>`;
  document.body.appendChild(modal);
  const submitFrame=document.createElement("iframe");
  submitFrame.name="contactSubmitFrame"; submitFrame.id="contactSubmitFrame"; submitFrame.style.display="none";
  document.body.appendChild(submitFrame);

  const open=()=>{
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden','false');
    document.body.classList.add('modal-open');
    setLang(sessionStorage.getItem('lang')||'en');
    setTimeout(()=>modal.querySelector('input[name="name"]')?.focus(),120);
  };
  const close=()=>{
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden','true');
    document.body.classList.remove('modal-open');
  };
  document.querySelectorAll('[data-contact-trigger]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();open()}));
  modal.querySelectorAll('[data-contact-close]').forEach(el=>el.addEventListener('click',close));
  document.addEventListener('keydown',e=>{if(e.key==='Escape' && modal.classList.contains('is-open')) close()});

  const form=modal.querySelector('#contactForm');
  const status=modal.querySelector('#contactStatus');
  let submitting=false;
  form.addEventListener('submit',()=>{
    if(submitting) return;
    submitting=true;
    const button=form.querySelector('button[type="submit"]');
    button.disabled=true;
    button.innerHTML='<span>Sending…</span>';
    status.className='contact-status';
    status.textContent=(sessionStorage.getItem('lang')||'en')==='fr'?'Envoi du message…':'Sending your message…';
    setTimeout(()=>{
      status.className='contact-status success';
      status.textContent=(sessionStorage.getItem('lang')||'en')==='fr'?'Message envoyé. Merci !':'Message sent. Thank you!';
      form.reset();
      button.disabled=false;
      button.innerHTML=(sessionStorage.getItem('lang')||'en')==='fr'?'<span>Envoyer le message →</span>':'<span>Send message →</span>';
      submitting=false;
    },1800);
  });

}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',injectContactModal); else injectContactModal();
