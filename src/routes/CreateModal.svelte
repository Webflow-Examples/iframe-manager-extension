<script lang="ts">
    import {ComposedModal, ModalHeader, ModalBody, TextArea, CodeSnippet, Button, Form} from "carbon-components-svelte";

    export let listAllIframes;

    /**
	 * The container element to insert/append the iframe to
	 */
	export let rootElementToInsert: AnyElement | null;


	/**
	 * Flag to see if the modal to create iframe custom elements is open
	 */
	export let isCreateModalOpen = false;

	const closeCreateFlow = () => {
		isCreateModalOpen = false;
	};

	const onIframeFormSubmit = (e: SubmitEvent) => {
		e.preventDefault();
		if (e.target) {
			const data = new FormData(e.target as HTMLFormElement, e.submitter);
			createIframe(data);
		}
	};

	// Create an iframe DOMElement and insert it into the root container
	const createIframe = async (data: FormData) => {
		if (!rootElementToInsert || !rootElementToInsert?.children) {
			webflow.notify({
				type: "Error",
				message: "No root element to insert the iframe into",
			});
			return;
		}
		if (!data) {
			webflow.notify({
				type: "Error",
				message: "No iframe code found",
			});
			return;
		}
		if (rootElementToInsert?.children) {
			// Create the iframe from a DOM element preset
			const newDomElement = await rootElementToInsert.append(webflow.elementPresets.DOM);
			await newDomElement.setTag('iframe');
			const attributePromises: Promise<null>[] = [];

			// Set attributes from iframe code snippet onto the element preset
			// Again, we don't need to await every setAttribute() call, so we can
			// track a list of the Promises returned from that method, and await for
			// them to resolve all at once
			for (const [_, val] of data) {
				const template = document.createElement('template');
				template.innerHTML = (val as string).trim();
				const result = template.content.children[0];
				if (result.hasAttributes()) {
					for (const attr of result.attributes) {
						attributePromises.push(newDomElement.setAttribute(attr.name, attr.value));
					}
				}
			}
			closeCreateFlow();
			await Promise.all(attributePromises);
			listAllIframes();
		}
	};
</script>

<ComposedModal
    open={isCreateModalOpen}
    on:close={closeCreateFlow}
>
    <ModalHeader label="Create" title="Create iframe" />
    <ModalBody class="modal-body">
        {#if !rootElementToInsert}
            <p>Select a root element in the Designer to insert the iframe</p>
        {:else}
            <Form class="iframe-attr-form create-iframe-form" on:submit={onIframeFormSubmit}>
                <TextArea labelText="Add iframe code" name="new-iframe-code" placeholder={`Add iframe HTML here or copy an example below...`} />
                <Button class="iframe-attr-form-submit" type="submit">Submit</Button>
            </Form>
            <div class="divider" />
            <div class="example-instructions">
                <h3>Examples</h3>
                <p>Spotify Example</p>
                <CodeSnippet code={`<iframe style="border-radius:12px" src="https://open.spotify.com/embed/episode/5OHKKw6CLYyJIIkHVQOzXn?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`} type="multi" hideCopyButton/>
                <p>Apple Music Example</p>
                <CodeSnippet code={`<iframe allow="autoplay *; encrypted-media *;" frameborder="0" height="150" style="width:100%;max-width:660px;overflow:hidden;background:transparent;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/album/nobody-gets-me/1657869377?i=1657869532"></iframe>`} type="multi" hideCopyButton />
                <p>Rive Example</p>
                <CodeSnippet code={`<iframe style="border: none" width="800" height="600" src="https://rive.app/s/R3dXkgO8Q0CbqkF3Sfuyng/embed" allowfullscreen allow="autoplay"></iframe>`} type="multi" hideCopyButton />
            </div>
        {/if}
    </ModalBody>
</ComposedModal>