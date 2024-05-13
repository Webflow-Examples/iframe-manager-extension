<script lang="ts">
	import { ClickableTile, Button} from "carbon-components-svelte";
	import Search from "carbon-icons-svelte/lib/Search.svelte";
	import Edit from "carbon-icons-svelte/lib/Edit.svelte";

	import CreateIframeModal from "./CreateModal.svelte";
	import EditAttributesModal from "./EditAttributesModal.svelte";
	import './styles.css';

	// State vars
	/**
	 * List of all iframe custom elements on a given page (along with a map of their HTML attributes)
	 */
	let iframeElements: Promise<IFrameElement>[];
	
	/**
	 * Flag to see if we've checked the page for iframes yet
	 */
	let hasCheckedIframes = false;
	
	/**
	 * Flag to see if the modal to edit iframe attributes is open
	 */
	let isEditModalOpen = false;
	/**
	 * The selected iframe element to edit
	 */
	let iframeSelected: IFrameElement;

	/**
	 * Flag to see if the modal to create iframe custom elements is open
	 */
	let isCreateModalOpen = false;

	/**
	 * The container element to insert/append the iframe to
	 */
	let rootElementToInsert: AnyElement | null;

	// Search the page for all iframe custom elements
	// 
	// Note: this won't include iframe elements inserted into HTML embed code snippets
	// as these elements are sandboxed and cannot be queried
	const listAllIframes = async () => {
		// Get all elements on the page
		const pageElements = await webflow.getAllElements();
		hasCheckedIframes = true;

		if (pageElements.length > 0) {
			// Mapping each page element on the page to a boolean "true" if an element is an
			// iframe. We'll use this to help filter the page DOMElements for iframes next
			const domElementTestMapping = await Promise.all(pageElements.map(async (el) => {
				if (el.type === "DOM") {
					if (await (el as DOMElement)?.getTag() === "iframe") {
						return true;
					}
				}
			}));

			// Get a list of only the DOMElements on the page that are iframes
			const filteredElements: DOMElement[] = pageElements.filter((_, idx) => domElementTestMapping[idx]) as DOMElement[];

			// Create a new structure that has the iframe DOMElement object, as well as its attributes
			// on the <iframe> tag
			iframeElements = filteredElements.map(async (el) => {
				const attributesArr = await el.getAllAttributes();
				const attributesObj = attributesArr.reduce((arr, attr) => ({
					...arr,
					[attr.name]: attr.value,
				}), {});
				return {
					el,
					attrs: attributesObj,
				} as IFrameElement;
			});
		} else {
			await webflow.notify({
				type: "Info",
				message: "There are no elements on the page",
			});
		}
	};

	// Find the correlated iframe in the Designer and scroll to it
	const selectIframeElement = (el: DOMElement) => {
		webflow.setSelectedElement(el);
	};

	// Ensure the user has a root container to insert the iframe into when we create one
	const openCreateFlow = () => {
		isCreateModalOpen = true;
		webflow.subscribe('selectedelement', (element: null | AnyElement) => {
			rootElementToInsert = element;
		});
	};
</script>

<h1>{"<iframe> Manager"}</h1>
<div class="main-container">
	<p>Manage all the iframe element blocks on your page.</p>
	<div class="main-option-btn-set">
		<Button on:click={listAllIframes}>List all iframes</Button>
		<Button on:click={openCreateFlow}>Create iframe</Button>
	</div>
	{#if hasCheckedIframes && iframeElements?.length > 0}
		<p>Click each iframe to find it on the Designer</p>
		<div role="group" aria-label="selectable tiles" class="iframe-container">
			{#each iframeElements as el}
				{#await el then iframeEl}
				<ClickableTile class="tile" on:click={(e) => {
					e.preventDefault();
					selectIframeElement(iframeEl.el);
				}}>
					<Button
						class="iframe-search-btn"
						iconDescription="Find in Designer"
						icon={Search}
						kind="ghost"
						on:click={(e) => {
							e.preventDefault();
							selectIframeElement(iframeEl.el);
						}}
					/>
					<iframe
						title="preview-iframe"
						{...iframeEl.attrs}
						width="100%"
						height="300px"
					></iframe>
					<div class="iframe-btn-group">
						<Button class="iframe-btn-action iframe-edit-btn" icon={Edit} on:click={() => {
							isEditModalOpen = true;
							iframeSelected = iframeEl;
						}}>Edit</Button>
						<Button class="iframe-btn-action" kind="danger" on:click={async () => {
							await iframeEl.el.remove();
							listAllIframes();
						}}>Delete</Button>
					</div>
				</ClickableTile>
				{/await}
			{/each}
		</div>
		{#if iframeSelected}
		<EditAttributesModal
			listAllIframes={listAllIframes}
			iframeSelected={iframeSelected}
			bind:isEditModalOpen={isEditModalOpen}
		/>
		{/if}
	{:else if hasCheckedIframes && iframeElements?.length <= 0 }
		<p>No iFrames found</p>
	{/if}
	<CreateIframeModal
		listAllIframes={listAllIframes}
		bind:isCreateModalOpen={isCreateModalOpen}
		bind:rootElementToInsert={rootElementToInsert}
	/>
</div>
