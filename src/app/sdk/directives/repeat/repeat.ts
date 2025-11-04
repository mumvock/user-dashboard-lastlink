import { AfterViewInit, Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';

@Directive({ selector: '[repeat]' })
export class RepeatDirective implements AfterViewInit {
    private readonly _templateRef = inject(TemplateRef<HTMLElement>);
    private readonly _viewContainer = inject(ViewContainerRef);

    @Input({ required: true })
    public set repeat(count: number) {

        if (count && Number.isInteger(count) && count > 0) {
            this._count = count;
        }
    }

    private _count = 1;

    public ngAfterViewInit(): void {
        this._repeatElement();
    }

    private _repeatElement(): void {

        for (let i = 0; i < this._count; i++) {
            this._viewContainer.createEmbeddedView(this._templateRef);
        }
    }
}
