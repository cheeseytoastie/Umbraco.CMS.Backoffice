import './workspace-view-member-group-info.element.js';

import { Meta, Story } from '@storybook/web-components';
import type { UmbWorkspaceViewMemberGroupInfoElement } from './workspace-view-member-group-info.element.js';
import { html } from '@umbraco-cms/backoffice/external/lit';

//import { data } from '../../../../../core/mocks/data/data-type.data.js';
//import { UmbDataTypeContext } from '../../data-type.context.js';


export default {
	title: 'Workspaces/Data Type/Views/Info',
	component: 'umb-workspace-view-member-group-info',
	id: 'umb-workspace-view-member-group-info',
	decorators: [
		(story) => {
			return html`TODO: make use of mocked workspace context??`;
			/*html` <umb-context-provider key="umbDataTypeContext" .value=${new UmbDataTypeWorkspaceContext(data[0])}>
				${story()}
			</umb-context-provider>`,*/
		},
	],
} as Meta;

export const AAAOverview: Story<UmbWorkspaceViewMemberGroupInfoElement> = () =>
	html` <umb-workspace-view-data-type-info></umb-workspace-view-data-type-info>`;
AAAOverview.storyName = 'Overview';