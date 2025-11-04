import { Component, computed, input } from '@angular/core';

import FEEDBACK_CARD_DEPENDENCIES from './feedback-card-dependencies';
import { FeedbackCardType } from './types/feedback-card-type.type';

const FEEDBACK_CARD_ICONS: Record<FeedbackCardType, string> = {
    error: 'cancel',
    success: 'check_circle',
    info: 'info',
    warning: 'warning',
    empty: 'indeterminate_question_box'
};

const FEEDBACK_CARD_STATUS: Record<FeedbackCardType, string> = {
    error: 'error',
    success: 'success',
    info: 'info',
    warning: 'warning',
    empty: 'none'
};

@Component({
    selector: 'app-feedback-card',
    templateUrl: './feedback-card.html',
    styleUrls: ['./feedback-card.scss'],
    imports: FEEDBACK_CARD_DEPENDENCIES.imports,
    providers: FEEDBACK_CARD_DEPENDENCIES.providers
})
export class FeedbackCard {
    public readonly type = input.required<FeedbackCardType>();

    protected readonly icon$$ = computed(() => {
        const type = this.type();

        return FEEDBACK_CARD_ICONS[type];
    });

    protected readonly status$$ = computed(() => {
        const type = this.type();

        return FEEDBACK_CARD_STATUS[type];
    });
}
