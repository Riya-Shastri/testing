import { Directive, Input, ViewContainerRef, TemplateRef } from '@angular/core';
import { AuthLoginService } from '../_services/auth.service';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective {
  @Input() appHasRole: string[];
  isVisible = false;

  constructor(private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private authService : AuthLoginService) { }


  ngOnInit(){
    const userRoles = this.authService.decodedToken.role as Array<string>;
    if(!userRoles){
      this.viewContainerRef.clear();
    }

    if(this.authService.isRoleMatch(this.appHasRole)){
      if(!this.isVisible){
        this.isVisible = true;
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      }else{
        this.isVisible = false;
        this.viewContainerRef.clear();
      }
    }
  }

  //if user has role

}
