import type { ManifestTypes } from '@umbraco-cms/backoffice/extension-registry';
import { manifest as blockListSchemaManifest } from './Umbraco.BlockList.js';

export const UMB_BLOCK_LIST_PROPERTY_EDITOR_ALIAS = 'Umbraco.BlockList';

export const manifests: Array<ManifestTypes> = [
	{
		type: 'propertyEditorUi',
		alias: 'Umb.PropertyEditorUi.BlockList',
		name: 'Block List Property Editor UI',
		js: () => import('./property-editor-ui-block-list.element.js'),
		meta: {
			label: 'Block List',
			propertyEditorSchemaAlias: UMB_BLOCK_LIST_PROPERTY_EDITOR_ALIAS,
			icon: 'icon-thumbnail-list',
			group: 'lists',
			settings: {
				properties: [
					{
						alias: 'useSingleBlockMode',
						label: 'Single block mode',
						description:
							'When in Single block mode, the output will be BlockListItem<>, instead of BlockListModel.\n\n**NOTE:**\nSingle block mode requires a maximum of one available block, and an amount set to minimum 1 and maximum 1 blocks.',
						propertyEditorUiAlias: 'Umb.PropertyEditorUi.Toggle',
					},
					{
						alias: 'useLiveEditing',
						label: 'Live editing mode',
						description:
							'Live editing in editor overlays for live updated custom views or labels using custom expression.',
						propertyEditorUiAlias: 'Umb.PropertyEditorUi.Toggle',
					},
					{
						alias: 'useInlineEditingAsDefault',
						label: 'Inline editing mode',
						description: 'Use the inline editor as the default block view.',
						propertyEditorUiAlias: 'Umb.PropertyEditorUi.Toggle',
					},
					{
						alias: 'maxPropertyWidth',
						label: 'Property editor width',
						description: 'Optional CSS override, example: 800px or 100%',
						propertyEditorUiAlias: 'Umb.PropertyEditorUi.TextBox',
					},
				],
			},
		},
	},
	blockListSchemaManifest,
];
