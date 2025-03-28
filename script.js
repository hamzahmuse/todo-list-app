// 🔹 Pastikan Supabase hanya diinisialisasi selepas halaman dimuat sepenuhnya
window.onload = function () {
    // 🔹 Gantikan dengan Supabase URL dan Anon Key sebenar
    const supabaseUrl = "https://sibxiwmlbjhhuhzmkzyw.supabase.co";
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpYnhpd21sYmpoaHVoem1renl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwNDUwNDYsImV4cCI6MjA1ODYyMTA0Nn0.cTc044-o9xivN-pXn9xOOjWaXSCKRHOTaylpISRvJgg";

    // 🔹 Inisialisasi Supabase
    window.supabase = supabase.createClient(supabaseUrl, supabaseKey);

    console.log("✅ Supabase berjaya diinisialisasi!", supabase);
};

// 🔹 Fungsi daftar pengguna baru

async function register() {
    let email = document.getElementById("email").value.trim(); // Buang whitespace
    let password = document.getElementById("password").value;

    // 🔹 Validasi Email
    let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
        alert("⚠ Sila masukkan email yang sah! Contoh: user@example.com");
        return;
    }

    // 🔹 Validasi Password
    if (password.length < 6) {
        alert("⚠ Password mesti sekurang-kurangnya 6 karakter!");
        return;
    }

    // 🔹 Panggil Supabase API
    let { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
    });

    // 🔹 Semak respons dari Supabase
    if (error) {
        console.error("❌ Error:", error.message);
        alert("Gagal daftar: " + error.message);
    } else {
        alert("✅ Pendaftaran berjaya! Sila semak email untuk pengesahan.");
    }
}


// 🔹 Fungsi login pengguna
async function login() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        console.error("❌ Error:", error.message);
        alert("Gagal login: " + error.message);
    } else {
        alert("✅ Login berjaya!");
        document.getElementById("authSection").style.display = "none";
        document.getElementById("appSection").style.display = "block";
    }
}

// 🔹 Fungsi logout
async function logout() {
    let { error } = await supabase.auth.signOut();
    if (error) {
        console.error("❌ Error:", error.message);
        alert("Gagal logout: " + error.message);
    } else {
        alert("✅ Logout berjaya!");
        document.getElementById("authSection").style.display = "block";
        document.getElementById("appSection").style.display = "none";
    }
}

async function addTask() {
    let taskInput = document.getElementById("task").value.trim();

    if (!taskInput) {
        alert("⚠ Masukkan tugasan terlebih dahulu!");
        return;
    }

    // 🔹 Dapatkan maklumat pengguna
    let { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
        alert("⚠ Anda perlu login terlebih dahulu!");
        return;
    }

    let userId = userData.user.id;

    // 🔹 Tambah tugasan ke Supabase
    let { data, error } = await supabase.from("tasks").insert([
        { task: taskInput, user_id: userId }
    ]);

    if (error) {
        console.error("❌ Error tambah tugasan:", error.message);
        alert("Gagal tambah tugasan: " + error.message);
    } else {
        alert("✅ Tugasan berjaya ditambah!");
        document.getElementById("task").value = ""; // Kosongkan input selepas tambah
        loadTasks(); // Muat semula senarai tugasan
    }
}


// Buat fungsi `loadTasks()` juga untuk memaparkan tugasan
async function loadTasks() {
    let { data, error } = await supabase.from("tasks").select("*");

    if (error) {
        console.error("❌ Error ambil tugasan:", error.message);
        return;
    }

    let taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    
    data.forEach((task) => {
        let li = document.createElement("li");
        li.textContent = task.task;

        // 🔹 Butang Edit
        let editBtn = document.createElement("button");
        editBtn.textContent = "✏ Edit";
        editBtn.onclick = () => updateTask(task.id);

        // 🔹 Butang Delete
        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌ Hapus";
        deleteBtn.onclick = () => deleteTask(task.id);

        li.appendChild(editBtn);
        li.appendChild(deleteBtn);


        taskList.appendChild(li);
    });
}
async function updateTask(taskId) {
    let newTask = prompt("Masukkan tugasan baru:");
    if (!newTask) return;

    let { error } = await supabase
        .from("tasks")
        .update({ task: newTask })
        .eq("id", taskId);

    if (error) {
        console.error("❌ Error kemas kini tugasan:", error.message);
        alert("Gagal kemas kini tugasan: " + error.message);
    } else {
        alert("✅ Tugasan berjaya dikemas kini!");
        loadTasks(); // Muat semula senarai tugasan
    }
}
async function deleteTask(taskId) {
    if (!confirm("Anda pasti mahu hapuskan tugasan ini?")) return;

    let { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId);

    if (error) {
        console.error("❌ Error hapus tugasan:", error.message);
        alert("Gagal hapus tugasan: " + error.message);
    } else {
        alert("✅ Tugasan berjaya dihapus!");
        loadTasks(); // Muat semula senarai tugasan
    }
}




// 🔹 Pastikan fungsi boleh diakses dari HTML
window.register = register;
window.login = login;
window.logout = logout;
window.addTask = addTask;
window.loadTasks = loadTasks;

