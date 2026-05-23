class Point {
  constructor(x, y, isPinned = false) {
    this.x = x;
    this.y = y;
    this.oldX = x;
    this.oldY = y;
    this.isPinned = isPinned;
  }
}

class LanyardSimulation {
  constructor(canvasId, cardId, containerId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.card = document.getElementById(cardId);
    this.container = document.getElementById(containerId);
    
    if (!this.canvas || !this.card || !this.container) return;
    
    this.points = [];
    // Adapt rope to container size (shorter on mobile)
    this.updateRopeParams();
    this.gravity = 0.6;
    this.friction = 0.96;
    this.bounce = 0.5;
    
    this.mouse = { x: -1000, y: -1000, vx: 0, vy: 0 };
    this.isHoveringCard = false;
    this.triggered = false;
    
    this.resize();
    window.addEventListener('resize', () => { this.updateRopeParams(); this.resize(); this.initPoints(); });
    
    const handleMove = (e) => {
      if (!this.triggered) return;
      const rect = this.container.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      
      if (clientX === undefined || clientY === undefined) return;
      
      const oldX = this.mouse.x;
      const oldY = this.mouse.y;
      this.mouse.x = clientX - rect.left;
      this.mouse.y = clientY - rect.top;
      this.mouse.vx = this.mouse.x - oldX;
      this.mouse.vy = this.mouse.y - oldY;
    };
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchmove', handleMove, { passive: true });

    this.card.addEventListener('mouseenter', () => this.isHoveringCard = true);
    this.card.addEventListener('mouseleave', () => this.isHoveringCard = false);
    // Touch: treat touchstart/end as hover-equivalent for mobile interaction
    this.card.addEventListener('touchstart', () => this.isHoveringCard = true, { passive: true });
    this.card.addEventListener('touchend',   () => this.isHoveringCard = false, { passive: true });
    
    this.initPoints();
    this.loop();
  }

  updateRopeParams() {
    const h = this.container.offsetHeight || 280;
    if (h < 350) {
      // Mobile / compact container
      this.segmentCount  = 8;
      this.segmentLength = 10;
    } else {
      // Desktop
      this.segmentCount  = 12;
      this.segmentLength = 12;
    }
  }
  
  resize() {
    this.canvas.width = this.container.offsetWidth;
    this.canvas.height = this.container.offsetHeight;
  }
  
  initPoints() {
    this.points = [];
    const startX = this.canvas.width / 2;
    this.points.push(new Point(startX, 0, true));
    for (let i = 1; i < this.segmentCount; i++) {
      // Start horizontally so it swings down
      this.points.push(new Point(startX + i * this.segmentLength, -30, false));
    }
  }
  
  update() {
    if (!this.triggered) {
      if (this.container.classList.contains('active')) {
         this.triggered = true;
         // Recalculate startX on trigger in case of resize
         this.initPoints();
      } else {
         return;
      }
    }

    for (let i = 0; i < this.points.length; i++) {
      const p = this.points[i];
      if (p.isPinned) {
        p.x = this.canvas.width / 2;
        p.y = 0;
        continue;
      }
      
      let vx = (p.x - p.oldX) * this.friction;
      let vy = (p.y - p.oldY) * this.friction;
      
      p.oldX = p.x;
      p.oldY = p.y;
      
      p.x += vx;
      p.y += vy;
      p.y += this.gravity;
      
      // Mouse interaction
      const dx = p.x - this.mouse.x;
      const dy = p.y - this.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 50) { 
        const force = (50 - dist) / 50;
        p.x += (dx / dist) * force * 3;
        p.y += (dy / dist) * force * 3;
      }
    }
    
    // Constraints (Sticks)
    for (let iter = 0; iter < 10; iter++) {
      for (let i = 0; i < this.points.length - 1; i++) {
        const p1 = this.points[i];
        const p2 = this.points[i+1];
        
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist === 0) continue;
        
        const difference = this.segmentLength - dist;
        const percent = difference / dist / 2;
        
        const offsetX = dx * percent;
        const offsetY = dy * percent;
        
        if (!p1.isPinned) {
          p1.x -= offsetX;
          p1.y -= offsetY;
        }
        if (!p2.isPinned) {
          p2.x += offsetX;
          p2.y += offsetY;
        }
      }
    }
    
    // Apply card hover force to the last point
    if (this.isHoveringCard) {
       const p = this.points[this.points.length - 1];
       // gently push it around
       p.x += Math.sin(Date.now() / 400) * 0.7;
       // push away from mouse velocity
       p.x += this.mouse.vx * 0.15;
       p.y += this.mouse.vy * 0.15;
    }
  }
  
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    if (!this.triggered) return;

    // Draw string
    this.ctx.beginPath();
    this.ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      this.ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    this.ctx.strokeStyle = '#434657'; // Dark gray
    this.ctx.lineWidth = 4;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.stroke();
    
    // Draw 3D shadow on string
    this.ctx.beginPath();
    this.ctx.moveTo(this.points[0].x - 1, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      this.ctx.lineTo(this.points[i].x - 1, this.points[i].y);
    }
    this.ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();

    // Draw clip
    const lastP = this.points[this.points.length - 1];
    const prevP = this.points[this.points.length - 2];
    const angle = Math.atan2(lastP.y - prevP.y, lastP.x - prevP.x);
    
    this.ctx.save();
    this.ctx.translate(lastP.x, lastP.y);
    this.ctx.rotate(angle);
    this.ctx.beginPath();
    this.ctx.rect(-3, -2, 6, 10);
    this.ctx.fillStyle = '#747689';
    this.ctx.fill();
    this.ctx.strokeStyle = '#2a2a2e';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
    
    // clip ring
    this.ctx.beginPath();
    this.ctx.arc(0, 8, 4, 0, Math.PI * 2);
    this.ctx.strokeStyle = '#747689';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    this.ctx.restore();
  }
  
  updateCard() {
    if (!this.triggered) {
      this.card.style.opacity = '0';
      return;
    }
    this.card.style.opacity = '1';
    
    const lastP = this.points[this.points.length - 1];
    const prevP = this.points[this.points.length - 2];
    
    let angle = Math.atan2(lastP.y - prevP.y, lastP.x - prevP.x) * (180 / Math.PI) - 90;
    
    if (angle > 70) angle = 70;
    if (angle < -70) angle = -70;
    
    const cardW = this.card.offsetWidth;
    const x = lastP.x - (cardW / 2);
    // Add offset for the ring
    const y = lastP.y + 10;
    
    this.card.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;
    this.card.style.transformOrigin = 'top center';
  }
  
  loop() {
    this.update();
    this.draw();
    this.updateCard();
    requestAnimationFrame(() => this.loop());
  }
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  new LanyardSimulation('lanyard-canvas', 'lanyard-card', 'lanyard-container');
});
