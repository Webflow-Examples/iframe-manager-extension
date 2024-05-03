<script lang="ts">
	import { ComposedModal, ModalHeader, ModalBody, TextInput, Form, Button, Grid, Row, Column } from "carbon-components-svelte";

    export let listAllIframes;

    /**
	 * Flag to see if the modal to edit iframe attributes is open
	 */
	export let isEditModalOpen = false;
	/**
	 * The selected iframe element to edit
	 */
	export let iframeSelected: IFrameElement;

    const onFormSubmit = (e: SubmitEvent) => {
		e.preventDefault();
		if (e.target) {
			const data = new FormData(e.target as HTMLFormElement, e.submitter);
			setEditedAttributes(data);
		}
	}

	// Set user-edited attributes back to iframe element
	const setEditedAttributes = async (data: FormData) => {
		if (data && iframeSelected) {
			const attrsObj: AttributeMap = {};
			for (const [key, val] of data) {
				if ((key as string).indexOf("-value") > -1) {
					const keyName = key.replace("-value", "");
					attrsObj[keyName] = val as string; 
				} else {
					attrsObj[key] = undefined;
				}
			}
			
			// Rather than awaiting every setAttribute() call to take place on the iframe,
			// we create a list of Promises and then await for these calls to resolve all at
			// once, as a performance benefit
			const promiseList: Promise<null>[] = [];
			Object.keys(attrsObj).forEach((attrName) => {
				promiseList.push(iframeSelected.el.setAttribute(attrName, attrsObj[attrName] || ""));
				iframeSelected.attrs = attrsObj;
			});
			isEditModalOpen = false;
			await Promise.all(promiseList);
			listAllIframes();
		}
	};
</script>

<ComposedModal
open={isEditModalOpen}
on:close={() => isEditModalOpen = false}
>
<ModalHeader label="Edit" title="Edit attributes" />
<ModalBody class="modal-body">
    <Form class="iframe-attr-form" on:submit={onFormSubmit}>
        <Grid class="modal-attr-grid">
            {#each Object.keys(iframeSelected.attrs) as attrKey}
            <Row>
                <Column>
                    <TextInput
                        labelText="Attribute Name"
                        name={attrKey}
                        placeholder="Attribute Name"
                        value={attrKey} 
                    />
                </Column>
                <Column>
                    <TextInput
                        labelText="Attribute Value"
                        name={`${attrKey}-value`}
                        placeholder="Attribute Value"
                        value={iframeSelected.attrs[attrKey]}
                    />
                </Column>
            </Row>
            {/each}
        </Grid>
        <Button class="iframe-attr-form-submit" type="submit">Submit</Button>
    </Form>
</ModalBody>
</ComposedModal>