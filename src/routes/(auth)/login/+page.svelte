<script>
  import { enhance } from "$app/forms";
  import { signIn } from "@auth/sveltekit/client";
  import GButton from "$lib/components/GButton.svelte";
  import Alert from "$lib/components/Alert.svelte";
  import { slide } from "svelte/transition";
  import { onMount } from "svelte";
  import { page } from "$app/stores";

  export let form;
  let message;


  onMount(() => {
    const params = $page.url.searchParams;
    if (params.get('resetSuccess') === 'true') {
      message = "Password reset successful. You can now log in.";
      setTimeout(() => {
        message = null;
        // Instead of goto, modify the URL directly
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('resetSuccess');
        history.replaceState({}, '', newUrl);
      }, 5000);
    } else if (params.get('registered') === 'true') {
      message = "Registration successful. You can now log in.";
      setTimeout(() => {
        message = null;
        // Instead of goto, modify the URL directly
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('registered');
        history.replaceState({}, '', newUrl);
      }, 5000);
    }
  });

</script>

<h1 class="text-center text-[2em] font-medium leading-[1em]">
  Login to your Account
</h1>

<div class="mt-[2em] w-full mx-auto">
  <form class="space-y-[1.1em]" method="POST" use:enhance>
    {#if form?.error}
      <div transition:slide={{ duration: 300 }} class="">
        <Alert bind:form error={true} />
      </div>
    {/if}

    {#if message}
      <div transition:slide={{ duration: 300 }} class="">
        <div
          class="text-[1.1em] bg-green-100 border border-green-400 text-green-700 px-[1em] py-[0.7em] rounded-[0.5em] relative"
          role="alert"
        >
          <span class="block sm:inline">
            {message}
          </span>
        </div>
      </div>
    {/if}

    <div class="space-y-[1.5em] mt-[0.3em]">
      <div>
        <input
          id="email"
          name="email"
          type="email"
          autocomplete="email"
          required
          placeholder="Email"
          class="inputFields"
        />
      </div>

      <div>
        <input
          id="password"
          name="password"
          type="password"
          autocomplete="current-password"
          required
          placeholder="Password"
          class="inputFields"
        />
      </div>
    </div>

    <a
      class="hover:opacity-75 ml-auto capitalize text-[#00804b] font-medium w-fit block"
      href="/forgot-password">Forgot password</a
    >
    <div>
      <button type="submit" class="authButton"> Sign in </button>
    </div>
  </form>

  <div
    class="my-[0.5em] uppercase text-[1.15em] text-[#707070] flex items-center justify-center gap-3"
  >
    <div class="bg-[#C4C4C4] w-full h-[2px]"></div>
    <p>or</p>
    <div class="bg-[#C4C4C4] w-full h-[2px]"></div>
  </div>

  <GButton on:click={() => signIn("google")} />

  <p
    class="mx-auto mt-[1.8em] lg:mt-[1.2em] text-center capitalize font-medium text-[#707070]"
  >
    Don't have an account <a
      class="text-[#00804b] font-semibold hover:opacity-75"
      href="/register">sign up</a
    >
  </p>
</div>
