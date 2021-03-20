function inviteLink() {
  const input = document.createElement("input");
  document.body.appendChild(input);
  input.value = "das hier wird kopiert";
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);
}
