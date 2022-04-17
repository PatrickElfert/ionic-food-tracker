import { AnimationController, Animation } from '@ionic/angular';
export const enterAnimation = (baseEl: HTMLElement, opts?: any): Animation => {
  const animationCtrl = new AnimationController();
  const rootAnimation = animationCtrl
    .create()
    .addElement(opts.enteringEl)
    .duration(300)
    .easing('ease-in')
    .fromTo('opacity', 0, 1);

  const leavingElement = animationCtrl
    .create()
    .addElement(opts.leavingEl)
    .duration(300)
    .easing('ease-in')
    .fromTo('opacity', 1, 0);

  return animationCtrl.create().addAnimation([rootAnimation, leavingElement]);
};
