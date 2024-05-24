import { UmbDocumentDetailRepository, UmbDocumentPublishingRepository } from '../repository/index.js';
import type { UmbDocumentVariantOptionModel } from '../types.js';
import { UMB_DOCUMENT_UNPUBLISH_MODAL } from '../modals/index.js';
import { UMB_APP_LANGUAGE_CONTEXT, UmbLanguageCollectionRepository } from '@umbraco-cms/backoffice/language';
import {
	type UmbEntityActionArgs,
	UmbEntityActionBase,
	UmbRequestReloadStructureForEntityEvent,
} from '@umbraco-cms/backoffice/entity-action';
import { UmbVariantId } from '@umbraco-cms/backoffice/variant';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UMB_MODAL_MANAGER_CONTEXT } from '@umbraco-cms/backoffice/modal';
import { UMB_ACTION_EVENT_CONTEXT } from '@umbraco-cms/backoffice/action';

export class UmbUnpublishDocumentEntityAction extends UmbEntityActionBase<never> {
	constructor(host: UmbControllerHost, args: UmbEntityActionArgs<never>) {
		super(host, args);
	}

	async execute() {
		if (!this.args.unique) throw new Error('The document unique identifier is missing');

		const languageRepository = new UmbLanguageCollectionRepository(this._host);
		const { data: languageData } = await languageRepository.requestCollection({});

		const documentRepository = new UmbDocumentDetailRepository(this._host);
		const { data: documentData } = await documentRepository.requestByUnique(this.args.unique);

		if (!documentData) throw new Error('The document was not found');

		const context = await this.getContext(UMB_APP_LANGUAGE_CONTEXT);
		const appCulture = context.getAppCulture();

		const options: Array<UmbDocumentVariantOptionModel> = documentData.variants.map<UmbDocumentVariantOptionModel>(
			(variant) => ({
				culture: variant.culture,
				segment: variant.segment,
				language: languageData?.items.find((language) => language.unique === variant.culture) ?? {
					name: appCulture!,
					entityType: 'language',
					fallbackIsoCode: null,
					isDefault: true,
					isMandatory: false,
					unique: appCulture!,
				},
				variant,
				unique: new UmbVariantId(variant.culture, variant.segment).toString(),
			}),
		);

		// Figure out the default selections
		// TODO: Missing features to pre-select the variant that fits with the variant-id of the tree/collection? (Again only relevant if the action is executed from a Tree or Collection) [NL]
		const selection: Array<string> = [];
		// If the app language is one of the options, select it by default:
		if (appCulture && options.some((o) => o.unique === appCulture)) {
			selection.push(new UmbVariantId(appCulture, null).toString());
		} else {
			// If not, select the first option by default:
			selection.push(options[0].unique);
		}

		const modalManagerContext = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
		const result = await modalManagerContext
			.open(this, UMB_DOCUMENT_UNPUBLISH_MODAL, {
				data: {
					documentUnique: this.args.unique,
					options,
				},
				value: { selection },
			})
			.onSubmit()
			.catch(() => undefined);

		if (!result?.selection.length) return;

		const variantIds = result?.selection.map((x) => UmbVariantId.FromString(x)) ?? [];

		if (variantIds.length) {
			const publishingRepository = new UmbDocumentPublishingRepository(this._host);
			await publishingRepository.unpublish(this.args.unique, variantIds);

			const actionEventContext = await this.getContext(UMB_ACTION_EVENT_CONTEXT);
			const event = new UmbRequestReloadStructureForEntityEvent({
				unique: this.args.unique,
				entityType: this.args.entityType,
			});

			actionEventContext.dispatchEvent(event);
		}
	}
}
export default UmbUnpublishDocumentEntityAction;
