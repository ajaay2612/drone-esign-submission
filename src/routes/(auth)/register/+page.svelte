<script>
  import { enhance } from "$app/forms";
  import { signIn } from "@auth/sveltekit/client";
  import Alert from "$lib/components/Alert.svelte";
  import GButton from "$lib/components/GButton.svelte";
  import { slide } from "svelte/transition";

  export let form;
</script>


  <h1 class="text-center text-[2em] font-medium leading-[1em]">
    Create a New Account
  </h1>

  <div class="mt-[2em] w-full mx-auto">
    <form class="space-y-[1.1em]" method="POST" use:enhance>

      {#if form?.error}
        <div transition:slide={{duration:300}} class="">
          <Alert bind:form={form} error={true} />
        </div>
      {/if}

      <div class="space-y-[1.5em] mt-[0.3em] mb-[1.4em]">
        <div>
          <input
            id="name"
            name="name"
            type="text"
            class="inputFields"
            placeholder="Name (optional)"
          />
        </div>
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
            required
            placeholder="Password"
            class="inputFields"
          />
        </div>
        <div>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            placeholder="Confirm Password"
            class="inputFields"
          />
        </div>
      </div>

      <div>
        <button type="submit" class="authButton"> Register </button>
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
      Already have an account? <a
        class="hover:opacity-75 text-[#00804b] font-semibold"
        href="/login">Sign in</a
      >
    </p>
  </div>
