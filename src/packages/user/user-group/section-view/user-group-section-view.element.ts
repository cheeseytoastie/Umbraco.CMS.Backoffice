import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { css, html, customElement } from '@umbraco-cms/backoffice/external/lit';

import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import { UmbRoute } from '@umbraco-cms/backoffice/router';

@customElement('umb-user-group-section-view')
export class UmbUserGroupSectionViewElement extends UmbLitElement {
	#routes: UmbRoute[] = [
		{
			path: 'collection',
			component: () => import('../collection/user-group-collection.element.js'),
		},
		{
			path: 'user-group',
			component: () => import('../workspace/user-group-workspace.element.js'),
		},
		{
			path: '',
			redirectTo: 'collection',
		},
	];

	render() {
		return html`<umb-router-slot id="router-slot" .routes=${this.#routes}></umb-router-slot>`;
	}

	static styles = [
		UmbTextStyles,
		css`
			:host {
				height: 100%;
			}

			#router-slot {
				height: calc(100% - var(--umb-header-layout-height));
			}
		`,
	];
}

export default UmbUserGroupSectionViewElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-user-group-section-view': UmbUserGroupSectionViewElement;
	}
}