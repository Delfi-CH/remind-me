<script>
    import { resolve } from "$app/paths";
</script>

<nav class="bg-primary sidebar vh-100 p-3 text-white" style="width: 150px;">
    <h5 class="mb-3 text-white">remind-me</h5>
    <ul class="nav flex-column">
        <li class="nav-item">
            <a class="nav-link text-white" href={resolve("/")}> Home </a>
            <a class="nav-link text-white" href={resolve("/settings")}>
                Settings
            </a>
        </li>
    </ul>
</nav>
