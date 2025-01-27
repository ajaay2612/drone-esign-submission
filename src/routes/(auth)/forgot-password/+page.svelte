<script>
    import { enhance } from '$app/forms';
    import Alert from "$lib/components/Alert.svelte";
    import { slide } from "svelte/transition";
    export let form;
</script>

    <h1 class="text-center text-[2em] font-medium leading-[1em]">
        Reset Password
    </h1>



    <div class="mt-[2em] w-full mx-auto">
        <form class="space-y-[1.1em]" method="POST" use:enhance>

            {#if form?.error}
                <div transition:slide={{duration:300}} class="">
                    <Alert bind:form={form} error={true} />
                </div>
            {/if}
        
            {#if form?.success}
                <div transition:slide={{duration:300}} class="">
                    <Alert bind:form={form}>
                        Check your email for password reset instructions.
                    </Alert>
                </div>
            {/if}

            <div class="space-y-[1.5em] mt-[0.3em]">
                <div >
                    <input
                        type="email"
                        id="email"
                        name="email"
                        class="inputFields"
                        required
                        placeholder="Email"
                    />
                </div>
            </div>
            <div>
                <button type="submit" class="authButton mt-[0.6em]">  Send Reset Link </button>
            </div>
        </form>
    </div>
