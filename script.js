$(document).ready(function() {
    // Function to fetch jobs
    const fetchJobs = () => {
        const jobTitle = $('.search input').val().trim();
        const location = $('.city input').val().trim();

        if (!jobTitle || !location) {
            $('#jobs-list').html('<p>Please enter both job title and location.</p>');
            return;
        }

        console.log(`Fetching jobs for title: "${jobTitle}" and location: "${location}"`);

        const settings = {
            async: true,
            crossDomain: true,
            url: `https://jsearch.p.rapidapi.com/estimated-salary?job_title=${encodeURIComponent(jobTitle)}&location=${encodeURIComponent(location)}&radius=50`,
            method: 'GET',
            headers: {
                'x-rapidapi-key': 'e40b396866msh6060c2809efa7a9p15cd8cjsn9d1d8b3bc3e9',
                'x-rapidapi-host': 'jsearch.p.rapidapi.com'
            }
        };

        $.ajax(settings)
            .done(function(response) {
                console.log('API Response:', response);

                const jobsList = $('#jobs-list');
                jobsList.empty(); // Clear previous results

                if (response && response.data && response.data.length > 0) {
                    response.data.forEach(job => {
                        const jobItem = `
                            <div class="job-item">
                                <h3>${job.job_title || 'No title available'}</h3>
                                <p><strong>Company:</strong> ${job.publisher_name || 'No company available'}</p>
                                <p><strong>Location:</strong> ${job.location || 'No location available'}</p>
                                <p><strong>Min Salary:</strong> ${job.min_salary ? `${job.min_salary.toLocaleString()} ${job.salary_currency}` : 'Salary not available'}</p>
                                <p><strong>Max Salary:</strong> ${job.max_salary ? `${job.max_salary.toLocaleString()} ${job.salary_currency}` : 'Salary not available'}</p>
                                <p><strong>Median Salary:</strong> ${job.median_salary ? `${job.median_salary.toLocaleString()} ${job.salary_currency}` : 'Salary not available'}</p>
                                <p><strong>Salary Period:</strong> ${job.salary_period || 'N/A'}</p>
                                <a href="${job.publisher_link || '#'}" target="_blank">View Job</a>
                            </div>
                        `;
                        jobsList.append(jobItem);
                    });
                } else {
                    jobsList.html('<p>No job listings found.</p>');
                }
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                console.error('AJAX Request Failed:', textStatus, errorThrown);
                $('#jobs-list').html(`<p>Error fetching job listings: ${textStatus}</p>`);
            });
    };

    // Toggle calculator visibility
    $('#calculatorButton').on('click', () => {
        $('#calculatorContainer').toggleClass('show-calculator');
    });

    // Calculator functionality
    const screen = document.querySelector('.calculator-container .screen');
    const buttons = document.querySelectorAll('.calculator-container .calc-button');
    let currentInput = '';

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.textContent.trim();

            if (value === 'C') {
                currentInput = '';
                screen.textContent = '0'; // Clear screen
            } else if (value === '←') {
                currentInput = currentInput.slice(0, -1);
                screen.textContent = currentInput || '0'; // Remove last character
            } else if (value === '=') {
                try {
                    screen.textContent = evaluateExpression(currentInput) || '0'; 
                    currentInput = screen.textContent; // Store result for further calculations
                } catch (error) {
                    screen.textContent = 'Error'; // Display error for invalid input
                    currentInput = ''; // Reset current input
                }
            } else {
                if (screen.textContent === '0' && value !== '0') screen.textContent = ''; // Remove default zero
                currentInput += value; // Append button value to current input
                screen.textContent = currentInput;
            }
        });
    });

    // Function to safely evaluate mathematical expressions
    function evaluateExpression(expression) {
        expression = expression.replace(/×/g, '*').replace(/÷/g, '/'); 
        if (/[^0-9+\-*/().]/.test(expression)) {
            throw new Error('Invalid characters');
        }
        return eval(expression);
    }

    // Fetch jobs on button click
    $('#searchButton').on('click', fetchJobs);
});
console.log(typeof $); // Should log 'function' if jQuery is loaded
document.getElementById('calculatorContainer').style.display = 'none'; // Ensure calculator is hidden by default

// Toggle calculator visibility
document.querySelector('.sidebar .side-nav .item i.bxs-calculator').addEventListener('click', function() {
    const calculator = document.getElementById('calculatorContainer');
    if (calculator.style.display === 'none' || calculator.style.display === '') {
        calculator.style.display = 'block';
    } else {
        calculator.style.display = 'none';
    }
});

// Hide calculator on close button click
document.getElementById('closeCalculator').addEventListener('click', function() {
    document.getElementById('calculatorContainer').style.display = 'none';
});
const searchGithub = async () => {
    const username = document.getElementById("searchInput").value;
    const response = await fetch(`https://api.github.com/users/${username}`);

    const detailsContainer = document.getElementById("result"); 
    const data = await response.json();

    if (response.ok) {
        detailsContainer.style.display = "block";  
        detailsContainer.innerHTML = `
            <div class="profile">
                <div class="profile-image">
                    <img src="${data.avatar_url}" alt="${data.login}'s avatar"/>
                </div>
                <div class="profile-details">
                    <h2 class="name">${data.name || data.login}</h2>
                    <p class="username">@${data.login}</p>
                    <p class="bio">${data.bio || 'Account doesn\'t have a bio.'}</p>
                    <div class="stats">
                        <div>
                            <div class="stats-name">Public Repos</div>
                            <div class="stats-value">${data.public_repos}</div>
                        </div>
                        <div>
                            <div class="stats-name">Followers</div>
                            <div class="stats-value">${data.followers}</div>
                        </div>
                        <div>
                            <div class="stats-name">Following</div>
                            <div class="stats-value">${data.following}</div>
                        </div>
                    </div>
                    <div class="media">
                        <p><span class="media-value">${data.location || 'Not Available'}</span></p>
                        <p><span class="media-value">${data.blog || 'Not Available'}</span></p>
                        <p><span class="media-value">${data.twitter_username || 'Not Available'}</span></p>
                        <p><span class="media-value">${data.company || 'Not Available'}</span></p>
                    </div>
                </div>
            </div>
        `;
    } else {
        alert(data.message);  
    }
};
