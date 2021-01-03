import PubSub from 'pubsub-js';

export default class Paginator {
  constructor(){
    this.scrollEvents();
    this.clickEvents();
    this.activeSlide = 1;
    this.canGo = 1;
    this.max = 6;
    this.delay = 1600;
  }

  // eslint-disable-next-line class-methods-use-this
  scrollEvents() {
    const self = this;

    $(window).on('wheel', (e) => {
      if(!self.canGo) return;
      const ne = e.originalEvent;
      // console.log(ne);
      const direction = ne.deltaY>0 ? 1: -1;
      const newslide = self.activeSlide + direction;
      if (newslide>self.max || newslide<1) return;
      self.canGo = false;
      PubSub.publish('gotoSlide', {from: self.activeSlide, to: newslide});
      self.activeSlide = newslide;
      setTimeout(function() {
        self.canGo = true;
      }, self.delay);
    })

  }

  // eslint-disable-next-line class-methods-use-this
  clickEvents() {
    const self = this;
    $('.pagination a').on('click', (e) => {
        e.preventDefault();
        if(!self.canGo) return;
        self.canGo = false;
        const newslide = $(e.currentTarget).data('gotoslide');
        if (newslide !== self.activeSlide){
          PubSub.publish('gotoSlide', {from: self.activeSlide, to: newslide});
          self.activeSlide = newslide;
          setTimeout(function() {
            self.canGo = true;
          }, self.delay);
        }
    })

  }

}
