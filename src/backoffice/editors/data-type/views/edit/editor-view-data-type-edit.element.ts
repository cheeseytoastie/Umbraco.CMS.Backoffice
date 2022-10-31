import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { css, html, LitElement, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { UmbModalService } from '../../../../../core/services/modal';
import { UmbDataTypeContext } from '../../data-type.context';
import type { DataTypeDetails } from '../../../../../core/mocks/data/data-type.data';
import { UmbObserverMixin } from '@umbraco-cms/observable-api';
import { UmbContextConsumerMixin } from '@umbraco-cms/context-api';
import type { ManifestPropertyEditorUI } from '@umbraco-cms/models';
import { umbExtensionsRegistry } from '@umbraco-cms/extensions-registry';

import '../../../../property-editor-uis/shared/property-editor-config/property-editor-config.element';

@customElement('umb-editor-view-data-type-edit')
export class UmbEditorViewDataTypeEditElement extends UmbContextConsumerMixin(UmbObserverMixin(LitElement)) {
	static styles = [UUITextStyles, css``];

	@state()
	_dataType?: DataTypeDetails;

	@state()
	private _propertyEditorUIIcon = '';

	@state()
	private _propertyEditorUIName = '';

	@state()
	private _propertyEditorUIAlias = '';

	@state()
	private _propertyEditorModelAlias = '';

	@state()
	private _data: Array<any> = [];

	private _dataTypeContext?: UmbDataTypeContext;
	private _modalService?: UmbModalService;

	constructor() {
		super();

		this.consumeAllContexts(['umbDataTypeContext', 'umbModalService'], (result) => {
			this._dataTypeContext = result['umbDataTypeContext'];
			this._modalService = result['umbModalService'];
			this._observeDataType();
		});
	}

	private _observeDataType() {
		if (!this._dataTypeContext) return;

		this.observe<DataTypeDetails>(this._dataTypeContext.data, (dataType) => {
			this._dataType = dataType;

			if (!this._dataType) return;

			if (this._dataType.propertyEditorModelAlias !== this._propertyEditorModelAlias) {
				this._observePropertyEditorModel(this._dataType.propertyEditorModelAlias);
			}

			if (this._dataType.propertyEditorUIAlias !== this._propertyEditorUIAlias) {
				this._observePropertyEditorUI(this._dataType.propertyEditorUIAlias);
			}

			if (this._dataType.data !== this._data) {
				this._data = this._dataType.data;
			}
		});
	}

	private _observePropertyEditorUI(propertyEditorUIAlias: string | null) {
		if (!propertyEditorUIAlias) return;

		this.observe<ManifestPropertyEditorUI>(
			umbExtensionsRegistry.getByAlias<ManifestPropertyEditorUI>(propertyEditorUIAlias),
			(propertyEditorUI) => {
				this._propertyEditorUIName = propertyEditorUI?.meta.label ?? propertyEditorUI?.name ?? '';
				this._propertyEditorUIAlias = propertyEditorUI?.alias ?? '';
				this._propertyEditorUIIcon = propertyEditorUI?.meta?.icon ?? '';

				this._observePropertyEditorModel(propertyEditorUI?.meta?.propertyEditorModel ?? '');
			}
		);
	}

	private _observePropertyEditorModel(propertyEditorModelAlias: string | null) {
		if (!propertyEditorModelAlias) return;

		this.observe(umbExtensionsRegistry.getByAlias(propertyEditorModelAlias), (propertyEditorModel) => {
			this._propertyEditorModelAlias = propertyEditorModel?.alias ?? '';
		});
	}

	private _openPropertyEditorUIPicker() {
		if (!this._dataType) return;

		const modalHandler = this._modalService?.propertyEditorUIPicker({
			selection: this._propertyEditorUIAlias ? [this._propertyEditorUIAlias] : [],
		});

		modalHandler?.onClose().then(({ selection } = {}) => {
			if (!selection) return;
			this._selectPropertyEditorUI(selection[0]);
		});
	}

	private _selectPropertyEditorUI(propertyEditorUIAlias: string | null) {
		if (!this._dataType || this._dataType.propertyEditorUIAlias === propertyEditorUIAlias) return;
		this._dataTypeContext?.update({ propertyEditorUIAlias });
	}

	render() {
		return html`
			<uui-box style="margin-bottom: 20px;"> ${this._renderPropertyEditorUI()} </uui-box>
			${this._renderConfig()} </uui-box>
		`;
	}

	private _renderPropertyEditorUI() {
		return html`
			<umb-editor-property-layout label="Property Editor" description="Select a property editor">
				${this._propertyEditorUIAlias
					? html`
							<!-- TODO: border is a bit weird attribute name. Maybe single or standalone would be better? -->
							<umb-ref-property-editor-ui
								slot="editor"
								name=${this._propertyEditorUIName}
								alias=${this._propertyEditorUIAlias}
								property-editor-model-alias=${this._propertyEditorModelAlias}
								border>
								<uui-icon name="${this._propertyEditorUIIcon}" slot="icon"></uui-icon>
								<uui-action-bar slot="actions">
									<uui-button label="Change" @click=${this._openPropertyEditorUIPicker}></uui-button>
								</uui-action-bar>
							</umb-ref-property-editor-ui>
					  `
					: html`
							<uui-button
								slot="editor"
								label="Select Property Editor"
								look="placeholder"
								color="default"
								@click=${this._openPropertyEditorUIPicker}></uui-button>
					  `}
			</umb-editor-property-layout>
		`;
	}

	private _renderConfig() {
		return html`
			${this._propertyEditorModelAlias && this._propertyEditorUIAlias
				? html`
						<uui-box headline="Config">
							<umb-property-editor-config
								property-editor-model-alias="${this._propertyEditorModelAlias}"
								property-editor-ui-alias="${this._propertyEditorUIAlias}"
								.data="${this._data}"></umb-property-editor-config>
						</uui-box>
				  `
				: nothing}
		`;
	}
}

export default UmbEditorViewDataTypeEditElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-editor-view-data-type-edit': UmbEditorViewDataTypeEditElement;
	}
}
