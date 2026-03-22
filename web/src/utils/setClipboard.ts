export const setClipboard = (value: string) => {
	const el = document.createElement("textarea");
	el.value = value;
	el.style.position = "fixed";
	el.style.opacity = "0";
	document.body.appendChild(el);
	el.select();
	document.execCommand("copy");
	document.body.removeChild(el);
};
