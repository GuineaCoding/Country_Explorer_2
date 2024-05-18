<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import Chart from 'chart.js/auto';
    import 'chartjs-adapter-date-fns';
    import { db } from '../services/firebase';
    import { ref, get } from 'firebase/database';

    let users = [];
    let loginTimes = {};
    let deviceCounts = {};

    onMount(async () => {
        const usersRef = ref(db, 'users');
        const snapshot = await get(usersRef);
        if (snapshot.exists()) {
            users = Object.entries(snapshot.val()).map(([key, value]) => {
                if (value.analytics && value.analytics.logins) {
                    Object.values(value.analytics.logins).forEach(login => {
                        const dateTime = new Date(login.date);
                        // Format as ISO string and remove minutes and seconds for hourly aggregation
                        const dateHour = dateTime.toISOString().slice(0, 13) + ':00:00';
                        loginTimes[dateHour] = (loginTimes[dateHour] || 0) + 1;

                        const deviceMatch = login.device.match(/(Windows|Android|iOS|Mac OS X|Linux)/i);
                        const device = deviceMatch ? deviceMatch[0] : 'Other';
                        deviceCounts[device] = (deviceCounts[device] || 0) + 1;
                    });
                }
                return {
                    id: key,
                    email: value.email,
                    loginCount: value.loginCount,
                    detailsPage: `/user-details/${key}`
                };
            });

            // Initialize the charts
            initCharts();
        }
    });

    function initCharts() {
        const loginTimeCtx = document.getElementById('loginTimeChart').getContext('2d');
        new Chart(loginTimeCtx, {
            type: 'line',
            data: {
                labels: Object.keys(loginTimes).sort(),
                datasets: [{
                    label: 'Logins Statistic',
                    data: Object.values(loginTimes),
                    borderColor: 'rgb(75, 192, 235)',
                    backgroundColor: 'rgba(75, 192, 235, 0.5)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'hour',
                            tooltipFormat: 'yyyy-MM-dd HH:mm',
                            displayFormats: {
                                hour: 'MMM dd, HH:mm'
                            }
                        }
                    }
                }
            }
        });

        const deviceChartCtx = document.getElementById('deviceChart').getContext('2d');
        new Chart(deviceChartCtx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(deviceCounts),
                datasets: [{
                    data: Object.values(deviceCounts),
                    backgroundColor: ['red', 'blue', 'green', 'orange', 'purple', 'grey'],
                    hoverOffset: 4
                }]
            }
        });
    }

    function goToUserPage(page) {
        navigate(page);
    }
</script>

<style>
    canvas {
        max-width: 100%;
        max-height: 500px; 
        margin-top: 20px;
        margin-bottom: 20px;
    }

    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-height: 100vh;
        background: linear-gradient(-45deg, #4eb99f, #122f41, #ed563b, #f2b035);
        background-size: 400% 400%;
        animation: gradient 15s ease infinite;
        padding: 20px;
        color: white;
    }

    table {
        width: 90%;
        margin-top: 20px;
        background-color: rgba(255, 255, 255, 0.1); 
        border-radius: 8px;
        overflow: hidden;
    }
    th, td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid rgba(255, 255, 255, 0.25);
    }
    th {
        background-color: rgba(0, 0, 0, 0.3);
    }
    tr:last-child td {
        border-bottom: none;
    }
    button {
        cursor: pointer;
        background-color: #f2b035; 
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        transition: background-color 0.2s ease;
        margin-top: 5px;
    }
    button:hover {
        background-color: #ed563b;
    }
</style>

<main>
    <h1>Admin Panel</h1>
    <table>
        <thead>
            <tr>
                <th>Email</th>
                <th>Login Count</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            {#each users as user}
                <tr>
                    <td>{user.email}</td>
                    <td>{user.loginCount}</td>
                    <td><button on:click={() => goToUserPage(user.detailsPage)}>View Details</button></td>
                </tr>
            {/each}
        </tbody>
    </table>
    <h1>Login Count</h1>
    <canvas id="loginTimeChart"></canvas>
    <h1>Device</h1>
    <canvas id="deviceChart"></canvas>
</main>
