import { css, html, LitElement } from 'lit';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { customElement, property } from 'lit/decorators.js';

import '../shared/tree-navigator.element';

import { UmbContextConsumerMixin, UmbContextProviderMixin } from '../../../core/context';
import { UmbExtensionManifestTree } from '../../../core/extension';
import { UmbTreeMemberGroupsContext } from './tree-member-groups.context';
import { UmbEntityStore } from '../../../core/stores/entity.store';

@customElement('umb-tree-member-groups')
export class UmbTreeMemberGroups extends UmbContextProviderMixin(UmbContextConsumerMixin(LitElement)) {
	static styles = [UUITextStyles, css``];

	private _treeContext?: UmbTreeMemberGroupsContext;

	@property({ attribute: false })
	public tree?: UmbExtensionManifestTree;

	private _entityStore?: UmbEntityStore;

	constructor() {
		super();

		this.consumeContext('umbEntityStore', (entityStore: UmbEntityStore) => {
			this._entityStore = entityStore;
			if (!this.tree || !this._entityStore) return;

			this._treeContext = new UmbTreeMemberGroupsContext(this.tree, this._entityStore);
			this.provideContext('umbTreeContext', this._treeContext);
		});
	}

	render() {
		return html`<umb-tree-navigator></umb-tree-navigator>`;
	}
}

export default UmbTreeMemberGroups;

declare global {
	interface HTMLElementTagNameMap {
		'umb-tree-member-groups': UmbTreeMemberGroups;
	}
}
