// ============================================================
// WORTH IT — SMART DAY PLANNER
// FINAL COMBINED VERSION
// ============================================================


// ============================================================
// DAY DATA
// ============================================================

const dayPlan = {

    tasks: [],

    events: [],

    energy: "",

    availableMinutes: null,

    planStart: 9 * 60,

    completedAt: null,

    currentSchedule: null

};


// ============================================================
// FOCUS MODE
// ============================================================

let focusTimer = null;

let focusSeconds = 0;

let focusTaskName = "";

let focusPaused = false;


// ============================================================
// START
// ============================================================

const startButton =
    document.getElementById("startButton");


if (startButton) {

    startButton.addEventListener(
        "click",
        showTaskInput
    );

}


// ============================================================
// TASK INPUT
// ============================================================

function showTaskInput() {

    dayPlan.tasks = [];

    dayPlan.events = [];

    dayPlan.energy = "";

    dayPlan.availableMinutes = null;

    dayPlan.currentSchedule = null;


    document.querySelector(".intro").innerHTML = `

        <div class="eyebrow">
            LET'S PLAN YOUR DAY
        </div>

        <h1>WHAT'S ON?</h1>

        <p>
            Add everything you want to get done today.
        </p>

        <div
            class="task-list"
            id="taskList"
        ></div>

        <button
            id="addTaskButton"
            class="secondary-button"
        >
            + ADD TASK
        </button>

        <button id="continueTasksButton">
            CONTINUE →
        </button>

    `;


    document
        .getElementById("addTaskButton")
        .addEventListener(
            "click",
            addTask
        );


    document
        .getElementById("continueTasksButton")
        .addEventListener(
            "click",
            showAvailableTime
        );


    addTask();

}


// ============================================================
// ADD TASK
// ============================================================

function addTask() {

    const taskList =
        document.getElementById("taskList");


    if (!taskList) {
        return;
    }


    const taskId =
        Date.now() + Math.random();


    const taskHTML = `

        <div
            class="task-card"
            id="task-${taskId}"
        >

            <input
                type="text"
                class="task-name"
                placeholder="What do you need to do?"
            >

            <div class="task-details">

                <div class="task-field">

                    <label>
                        DURATION
                    </label>

                    <select class="task-duration">

                        <option value="15">
                            15 min
                        </option>

                        <option
                            value="30"
                            selected
                        >
                            30 min
                        </option>

                        <option value="60">
                            1 hour
                        </option>

                        <option value="90">
                            1.5 hours
                        </option>

                        <option value="120">
                            2 hours
                        </option>

                        <option value="180">
                            3 hours
                        </option>

                    </select>

                </div>


                <div class="task-field">

                    <label>
                        DEADLINE
                    </label>

                    <input
                        type="time"
                        class="task-deadline"
                    >

                </div>

            </div>


            <button
                class="remove-task"
                data-id="${taskId}"
            >
                REMOVE
            </button>

        </div>

    `;


    taskList.insertAdjacentHTML(
        "beforeend",
        taskHTML
    );


    const removeButton =
        document.querySelector(
            `[data-id="${taskId}"]`
        );


    if (removeButton) {

        removeButton.addEventListener(
            "click",
            function () {

                const card =
                    document.getElementById(
                        `task-${taskId}`
                    );


                if (card) {
                    card.remove();
                }

            }
        );

    }

}


// ============================================================
// COLLECT TASKS
// ============================================================

function collectTasks() {

    const taskCards =
        document.querySelectorAll(
            "#taskList .task-card"
        );


    dayPlan.tasks = [];


    taskCards.forEach(
        function (card) {

            const name =
                card
                    .querySelector(".task-name")
                    .value
                    .trim();


            const duration =
                Number(
                    card
                        .querySelector(".task-duration")
                        .value
                );


            const deadline =
                card
                    .querySelector(".task-deadline")
                    .value;


            if (!name) {
                return;
            }


            dayPlan.tasks.push({

                name: name,

                duration: duration,

                deadline: deadline,

                completed: false,

                completedAt: null

            });

        }
    );

}


// ============================================================
// AVAILABLE TIME
// ============================================================

function showAvailableTime() {

    collectTasks();


    if (
        dayPlan.tasks.length === 0
    ) {

        alert(
            "Please add at least one task."
        );

        return;

    }


    document.querySelector(
        ".intro"
    ).innerHTML = `

        <div class="eyebrow">
            HOW MUCH TIME DO YOU REALLY HAVE?
        </div>

        <h1>
            YOUR TIME.
        </h1>

        <p>
            You don't need to fill your entire day.
            Tell WORTH IT how much time you actually have.
        </p>


        <div class="time-options">

            <button
                class="time-choice"
                data-minutes="60"
            >
                <strong>1 HOUR</strong>
                <span>Only the essentials</span>
            </button>


            <button
                class="time-choice"
                data-minutes="120"
            >
                <strong>2 HOURS</strong>
                <span>Focus on what matters</span>
            </button>


            <button
                class="time-choice"
                data-minutes="180"
            >
                <strong>3 HOURS</strong>
                <span>A focused day</span>
            </button>


            <button
                class="time-choice"
                data-minutes="240"
            >
                <strong>4 HOURS</strong>
                <span>More room to progress</span>
            </button>


            <button
                class="time-choice"
                data-minutes="360"
            >
                <strong>6 HOURS</strong>
                <span>A fuller day</span>
            </button>

        </div>


        <div class="answer-box">

            <label class="custom-time-label">
                OR ENTER YOUR OWN TIME
            </label>

            <input
                type="number"
                id="customAvailableHours"
                min="0.5"
                max="12"
                step="0.5"
                placeholder="Example: 3.5"
            >

            <button
                id="customTimeButton"
            >
                USE THIS TIME →
            </button>

            <button
                id="fullDayButton"
                class="secondary-button"
            >
                I HAVE MOST OF THE DAY
            </button>

        </div>

    `;


    document
        .querySelectorAll(".time-choice")
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        dayPlan.availableMinutes =
                            Number(
                                button.dataset.minutes
                            );

                        showAvailableTimeConfirmation();

                    }
                );

            }
        );


    document
        .getElementById(
            "customTimeButton"
        )
        .addEventListener(
            "click",
            useCustomTime
        );


    document
        .getElementById(
            "fullDayButton"
        )
        .addEventListener(
            "click",
            function () {

                dayPlan.availableMinutes =
                    null;

                showAvailableTimeConfirmation();

            }
        );

}


// ============================================================
// CUSTOM TIME
// ============================================================

function useCustomTime() {

    const input =
        document.getElementById(
            "customAvailableHours"
        );


    const hours =
        Number(input.value);


    if (
        !hours ||
        hours <= 0
    ) {

        alert(
            "Please enter how many hours you have."
        );

        return;

    }


    dayPlan.availableMinutes =
        Math.round(hours * 60);


    showAvailableTimeConfirmation();

}


// ============================================================
// TIME CONFIRMATION
// ============================================================

function showAvailableTimeConfirmation() {

    let message =
        "I'll protect the most important things first.";


    if (
        dayPlan.availableMinutes !== null
    ) {

        message =
            `You have ${formatDuration(
                dayPlan.availableMinutes
            )}. I'll decide what is actually worth fitting in.`;

    }


    document.querySelector(
        ".intro"
    ).innerHTML = `

        <div class="eyebrow">
            SMART PRIORITIZATION
        </div>

        <h1>
            WHAT'S WORTH IT?
        </h1>

        <p>
            ${escapeHTML(message)}
        </p>

        <button
            id="continueTimeButton"
        >
            CONTINUE →
        </button>

    `;


    document
        .getElementById(
            "continueTimeButton"
        )
        .addEventListener(
            "click",
            showCommitments
        );

}


// ============================================================
// COMMITMENTS
// ============================================================

function showCommitments() {

    document.querySelector(
        ".intro"
    ).innerHTML = `

        <div class="eyebrow">
            WHAT CAN'T MOVE?
        </div>

        <h1>
            YOUR COMMITMENTS.
        </h1>

        <p>
            Add classes, appointments,
            meals, or anything already fixed.
        </p>

        <div
            class="task-list"
            id="eventList"
        ></div>

        <button
            id="addEventButton"
            class="secondary-button"
        >
            + ADD FIXED EVENT
        </button>

        <button
            id="continueEventsButton"
        >
            CONTINUE →
        </button>

    `;


    document
        .getElementById(
            "addEventButton"
        )
        .addEventListener(
            "click",
            addFixedEvent
        );


    document
        .getElementById(
            "continueEventsButton"
        )
        .addEventListener(
            "click",
            function () {

                collectEvents();

                showEnergyQuestion();

            }
        );


    addFixedEvent();

}


// ============================================================
// ADD FIXED EVENT
// ============================================================

function addFixedEvent() {

    const eventList =
        document.getElementById(
            "eventList"
        );


    if (!eventList) {
        return;
    }


    const eventId =
        Date.now() + Math.random();


    const eventHTML = `

        <div
            class="task-card"
            id="event-${eventId}"
        >

            <input
                type="text"
                class="event-name"
                placeholder="Example: College"
            >


            <div class="task-details">

                <div class="task-field">

                    <label>
                        START
                    </label>

                    <input
                        type="time"
                        class="event-start"
                        value="10:00"
                    >

                </div>


                <div class="task-field">

                    <label>
                        END
                    </label>

                    <input
                        type="time"
                        class="event-end"
                        value="16:00"
                    >

                </div>

            </div>


            <button
                class="remove-task"
                data-event-id="${eventId}"
            >
                REMOVE
            </button>

        </div>

    `;


    eventList.insertAdjacentHTML(
        "beforeend",
        eventHTML
    );


    const removeButton =
        document.querySelector(
            `[data-event-id="${eventId}"]`
        );


    if (removeButton) {

        removeButton.addEventListener(
            "click",
            function () {

                const card =
                    document.getElementById(
                        `event-${eventId}`
                    );


                if (card) {
                    card.remove();
                }

            }
        );

    }

}


// ============================================================
// COLLECT EVENTS
// ============================================================

function collectEvents() {

    const eventCards =
        document.querySelectorAll(
            "#eventList .task-card"
        );


    dayPlan.events = [];


    eventCards.forEach(
        function (card) {

            const name =
                card
                    .querySelector(".event-name")
                    .value
                    .trim();


            const start =
                card
                    .querySelector(".event-start")
                    .value;


            const end =
                card
                    .querySelector(".event-end")
                    .value;


            if (
                !name ||
                !start ||
                !end
            ) {

                return;

            }


            if (
                timeToMinutes(end)
                <=
                timeToMinutes(start)
            ) {

                return;

            }


            dayPlan.events.push({

                name: name,

                start: start,

                end: end

            });

        }
    );

}


// ============================================================
// ENERGY
// ============================================================

function showEnergyQuestion() {

    document.querySelector(
        ".intro"
    ).innerHTML = `

        <div class="eyebrow">
            ONE LAST THING
        </div>

        <h1>
            YOUR ENERGY.
        </h1>

        <p>
            How are you feeling today?
        </p>


        <div class="choices">

            <button
                class="choice"
                data-energy="low"
            >
                LOW
            </button>

            <button
                class="choice"
                data-energy="calm"
            >
                CALM
            </button>

            <button
                class="choice"
                data-energy="good"
            >
                GOOD
            </button>

            <button
                class="choice"
                data-energy="high"
            >
                HIGH
            </button>

        </div>

    `;


    document
        .querySelectorAll(".choice")
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        dayPlan.energy =
                            button.dataset.energy;

                        generateDay();

                    }
                );

            }
        );

}


// ============================================================
// UNDERSTAND TASK
// ============================================================

function understandTask(
    taskName
) {

    const text =
        taskName.toLowerCase();


    if (
        text.includes("submit") ||
        text.includes("deadline") ||
        text.includes("urgent") ||
        text.includes("due") ||
        text.includes("application") ||
        text.includes("pay") ||
        text.includes("register")
    ) {

        return "urgent";

    }


    if (
        text.includes("study") ||
        text.includes("learn") ||
        text.includes("exam") ||
        text.includes("test") ||
        text.includes("assignment") ||
        text.includes("code") ||
        text.includes("coding") ||
        text.includes("read") ||
        text.includes("research") ||
        text.includes("project") ||
        text.includes("homework") ||
        text.includes("practice") ||
        text.includes("prepare") ||
        text.includes("presentation")
    ) {

        return "mental";

    }


    if (
        text.includes("gym") ||
        text.includes("exercise") ||
        text.includes("workout") ||
        text.includes("run") ||
        text.includes("walk") ||
        text.includes("clean") ||
        text.includes("shopping") ||
        text.includes("cook") ||
        text.includes("laundry")
    ) {

        return "physical";

    }


    if (
        text.includes("watch") ||
        text.includes("movie") ||
        text.includes("relax") ||
        text.includes("break") ||
        text.includes("music") ||
        text.includes("call") ||
        text.includes("family") ||
        text.includes("friend") ||
        text.includes("scroll")
    ) {

        return "light";

    }


    return "general";

}


// ============================================================
// TYPE LABEL
// ============================================================

function getTaskTypeLabel(
    type
) {

    if (type === "mental") {
        return "MENTALLY INTENSIVE";
    }


    if (type === "physical") {
        return "PHYSICAL TASK";
    }


    if (type === "urgent") {
        return "URGENT";
    }


    if (type === "light") {
        return "LIGHT TASK";
    }


    return "GENERAL TASK";

}


// ============================================================
// PRIORITY
// ============================================================

function calculatePriority(
    task
) {

    const text =
        task.name.toLowerCase();


    let priority = 1;


    if (
        text.includes("exam") ||
        text.includes("test") ||
        text.includes("assignment") ||
        text.includes("submit") ||
        text.includes("deadline") ||
        text.includes("urgent") ||
        text.includes("due") ||
        text.includes("application") ||
        text.includes("register")
    ) {

        priority = 3;

    }


    else if (
        text.includes("study") ||
        text.includes("project") ||
        text.includes("work") ||
        text.includes("meeting") ||
        text.includes("class") ||
        text.includes("prepare")
    ) {

        priority = 2;

    }


    if (
        task.deadline !== ""
    ) {

        priority = 3;

    }


    return priority;

}


// ============================================================
// ENERGY SCORE
// ============================================================

function getEnergyScore(
    task
) {

    if (
        task.type === "mental" ||
        task.type === "urgent"
    ) {

        if (
            dayPlan.energy === "high"
        ) {
            return 3;
        }


        if (
            dayPlan.energy === "good"
        ) {
            return 2;
        }


        if (
            dayPlan.energy === "calm"
        ) {
            return 1;
        }


        return 0;

    }


    if (
        task.type === "light"
    ) {

        if (
            dayPlan.energy === "low"
        ) {
            return 3;
        }


        return 1;

    }


    if (
        task.type === "physical"
    ) {

        if (
            dayPlan.energy === "good" ||
            dayPlan.energy === "high"
        ) {

            return 2;

        }


        return 1;

    }


    return 1;

}


// ============================================================
// VALUE SCORE
// ============================================================

function calculateValueScore(
    task
) {

    let score = 0;


    // Importance

    score +=
        task.priority * 30;


    // Energy match

    score +=
        task.energyScore * 10;


    // Deadline

    if (
        task.deadline
    ) {

        score += 35;

    }


    // Meaningful / personal tasks

    const text =
        task.name.toLowerCase();


    if (
        text.includes("family") ||
        text.includes("friend") ||
        text.includes("call") ||
        text.includes("health") ||
        text.includes("doctor")
    ) {

        score += 15;

    }


    // Avoid rewarding tiny tasks too much

    if (
        task.duration <= 15
    ) {

        score += 3;

    }


    return score;

}


// ============================================================
// GENERATE DAY
// ============================================================

function generateDay() {

    const tasks =
        dayPlan.tasks
            .filter(
                function (task) {

                    return !task.completed;

                }
            )
            .map(
                function (task) {

                    const type =
                        understandTask(
                            task.name
                        );


                    const prepared = {

                        name:
                            task.name,

                        duration:
                            task.duration,

                        deadline:
                            task.deadline,

                        priority:
                            calculatePriority(
                                task
                            ),

                        type:
                            type,

                        energyScore:
                            getEnergyScore({

                                name:
                                    task.name,

                                type:
                                    type

                            })

                    };


                    prepared.valueScore =
                        calculateValueScore(
                            prepared
                        );


                    return prepared;

                }
            );


    tasks.sort(
        compareTasks
    );


    const schedule =
        buildSmartSchedule(
            tasks,
            dayPlan.planStart,
            dayPlan.availableMinutes
        );


    dayPlan.currentSchedule =
        schedule;


    showDayResult(
        schedule
    );

}


// ============================================================
// TASK COMPARATOR
// ============================================================

function compareTasks(
    a,
    b
) {

    // Deadlines first

    if (
        a.deadline &&
        b.deadline
    ) {

        const deadlineDifference =
            timeToMinutes(
                a.deadline
            )
            -
            timeToMinutes(
                b.deadline
            );


        if (
            deadlineDifference !== 0
        ) {

            return deadlineDifference;

        }

    }


    if (
        a.deadline
    ) {
        return -1;
    }


    if (
        b.deadline
    ) {
        return 1;
    }


    // Value

    if (
        a.valueScore !==
        b.valueScore
    ) {

        return (
            b.valueScore -
            a.valueScore
        );

    }


    // Priority

    return (
        b.priority -
        a.priority
    );

}


// ============================================================
// SMART SCHEDULE
// ============================================================

function buildSmartSchedule(
    tasks,
    startTime,
    availableMinutes
) {

    const END_OF_DAY =
        22 * 60;


    const events =
        getEvents();


    const schedule = [];


    let currentTime =
        startTime;


    let usedTaskMinutes = 0;


    const unscheduled = [];


    // Available limit

    let timeLimit =
        END_OF_DAY;


    if (
        availableMinutes !== null &&
        availableMinutes !== undefined
    ) {

        timeLimit =
            Math.min(
                END_OF_DAY,
                startTime +
                availableMinutes
            );

    }


    tasks.forEach(
        function (task) {

            let searchTime =
                currentTime;


            let placed =
                false;


            while (
                searchTime +
                task.duration
                <=
                timeLimit
            ) {

                const conflict =
                    findConflict(
                        searchTime,
                        searchTime +
                        task.duration,
                        events
                    );


                if (!conflict) {

                    // Deadline protection

                    if (
                        task.deadline
                    ) {

                        const deadline =
                            timeToMinutes(
                                task.deadline
                            );


                        if (
                            searchTime +
                            task.duration
                            >
                            deadline
                        ) {

                            searchTime += 10;

                            continue;

                        }

                    }


                    schedule.push({

                        type:
                            "task",

                        name:
                            task.name,

                        start:
                            searchTime,

                        end:
                            searchTime +
                            task.duration,

                        duration:
                            task.duration,

                        priority:
                            task.priority,

                        deadline:
                            task.deadline,

                        taskType:
                            task.type,

                        valueScore:
                            task.valueScore

                    });


                    currentTime =
                        searchTime +
                        task.duration +
                        10;


                    usedTaskMinutes +=
                        task.duration;


                    placed =
                        true;


                    break;

                }


                searchTime =
                    conflict.end;

            }


            if (!placed) {

                unscheduled.push(
                    task
                );

            }

        }
    );


    // Add fixed commitments

    events.forEach(
        function (event) {

            if (
                event.end >
                startTime
            ) {

                schedule.push({

                    type:
                        "event",

                    name:
                        event.name,

                    start:
                        Math.max(
                            event.start,
                            startTime
                        ),

                    end:
                        event.end

                });

            }

        }
    );


    schedule.sort(
        function (a, b) {

            return (
                a.start -
                b.start
            );

        }
    );


    return {

        items:
            schedule,

        unscheduled:
            unscheduled,

        usedMinutes:
            usedTaskMinutes,

        availableMinutes:
            availableMinutes,

        startTime:
            startTime,

        endTime:
            timeLimit

    };

}


// ============================================================
// GET EVENTS
// ============================================================

function getEvents() {

    return dayPlan.events
        .map(
            function (event) {

                return {

                    name:
                        event.name,

                    start:
                        timeToMinutes(
                            event.start
                        ),

                    end:
                        timeToMinutes(
                            event.end
                        )

                };

            }
        )
        .sort(
            function (a, b) {

                return (
                    a.start -
                    b.start
                );

            }
        );

}


// ============================================================
// FIND CONFLICT
// ============================================================

function findConflict(
    start,
    end,
    events
) {

    for (
        let i = 0;
        i < events.length;
        i++
    ) {

        const event =
            events[i];


        if (
            start < event.end &&
            end > event.start
        ) {

            return event;

        }

    }


    return null;

}


// ============================================================
// SHOW DAY RESULT
// ============================================================

function showDayResult(
    schedule
) {

    let timelineHTML =
        "";


    schedule.items.forEach(
        function (item) {

            const startTime =
                formatMinutes(
                    item.start
                );


            const endTime =
                formatMinutes(
                    item.end
                );


            // Fixed event

            if (
                item.type ===
                "event"
            ) {

                timelineHTML += `

                    <div
                        class="timeline-item fixed-event"
                    >

                        <div
                            class="timeline-time"
                        >
                            ${startTime}
                            –
                            ${endTime}
                        </div>

                        <div
                            class="timeline-task"
                        >
                            ${escapeHTML(
                                item.name
                            )}
                        </div>

                        <div
                            class="timeline-priority"
                        >
                            FIXED COMMITMENT
                        </div>

                    </div>

                `;


                return;

            }


            let priorityText =
                "FLEXIBLE";


            if (
                item.priority === 3
            ) {

                priorityText =
                    "HIGH PRIORITY";

            }

            else if (
                item.priority === 2
            ) {

                priorityText =
                    "IMPORTANT";

            }


            const taskTypeText =
                getTaskTypeLabel(
                    item.taskType
                );


            let deadlineHTML =
                "";


            if (
                item.deadline
            ) {

                deadlineHTML = `

                    <div
                        class="timeline-deadline"
                    >

                        DEADLINE:
                        ${formatDeadline(
                            item.deadline
                        )}

                    </div>

                `;

            }


            timelineHTML += `

                <div
                    class="timeline-item"
                >

                    <div
                        class="timeline-time"
                    >
                        ${startTime}
                        –
                        ${endTime}
                    </div>


                    <div
                        class="timeline-task"
                    >
                        ${escapeHTML(
                            item.name
                        )}
                    </div>


                    <div
                        class="timeline-duration"
                    >
                        ${formatDuration(
                            item.duration
                        )}
                    </div>


                    <div
                        class="timeline-priority"
                    >
                        ${priorityText}
                    </div>


                    <div
                        class="timeline-priority"
                    >
                        ${taskTypeText}
                    </div>


                    ${deadlineHTML}


                    <button
                        class="done-button"
                        data-task-name="${escapeHTML(
                            item.name
                        )}"
                    >
                        ✓ DONE
                    </button>


                    <button
                        class="focus-button"
                        data-focus-task="${escapeHTML(
                            item.name
                        )}"
                    >
                        🎯 FOCUS NOW
                    </button>

                </div>

            `;

        }
    );


    // Unscheduled

    if (
        schedule.unscheduled.length >
        0
    ) {

        timelineHTML += `

            <div
                class="timeline-item unscheduled-item"
            >

                <div
                    class="timeline-task"
                >
                    NOT EVERYTHING FITS.
                </div>

                <div
                    class="timeline-duration"
                >
                    WORTH IT protected the
                    highest-value tasks first.
                </div>

                <div
                    class="timeline-duration"
                >
                    Waiting:
                    ${schedule.unscheduled
                        .map(
                            function (task) {

                                return escapeHTML(
                                    task.name
                                );

                            }
                        )
                        .join(", ")
                    }
                </div>

            </div>

        `;

    }


    // Time information

    let timeSummary =
        "Your day is planned around your priorities.";


    if (
        schedule.availableMinutes !==
        null
    ) {

        timeSummary =
            `You gave WORTH IT ${formatDuration(
                schedule.availableMinutes
            )}.
            It protected the highest-value work first.`;

    }


    document.querySelector(
        ".intro"
    ).innerHTML = `

        <div class="eyebrow">
            YOUR DAY STARTS HERE
        </div>


        <h1>
            WORTH IT.
        </h1>


        <p>
            ${escapeHTML(
                timeSummary
            )}
        </p>


        <!-- RIGHT NOW -->

        <div
            class="right-now-card"
            id="rightNowCard"
        >

            ${generateRightNow(
                schedule
            )}

        </div>


        <!-- WHY -->

        <div
            class="why-plan-card"
        >

            <div
                class="why-plan-title"
            >
                WHY THIS PLAN?
            </div>

            <div
                class="why-plan-text"
            >
                ${generatePlanExplanation()}
            </div>

        </div>


        <!-- PROGRESS -->

        <div
            class="progress-section"
            id="progressSection"
        >

            <div
                class="progress-header"
            >

                <div
                    class="progress-title"
                >
                    TODAY'S PROGRESS
                </div>

                <div
                    class="progress-percent"
                    id="progressPercent"
                >
                    0%
                </div>

            </div>


            <div
                class="progress-bar"
            >

                <div
                    class="progress-fill"
                    id="progressFill"
                ></div>

            </div>


            <div
                class="progress-info"
                id="progressInfo"
            >
                0 of
                ${dayPlan.tasks.length}
                tasks completed
            </div>

        </div>


        <!-- TIMELINE -->

        <div class="timeline">

            ${timelineHTML}

        </div>


        <!-- ACTIONS -->

        <button
            id="worthItMomentButton"
        >
            ❤️ WORTH IT MOMENT
        </button>


        <button
            id="lateButton"
        >
            I'M RUNNING LATE →
        </button>


        <button
            id="replanButton"
        >
            MY DAY CHANGED ↻
        </button>


        <button
            id="rightNowButton"
            class="secondary-button"
        >
            🎯 WHAT SHOULD I DO RIGHT NOW?
        </button>


        <button
            id="restartButton"
            class="secondary-button"
        >
            START AGAIN
        </button>

    `;


    // Done buttons

    document
        .querySelectorAll(
            ".done-button"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const taskName =
                            button.dataset.taskName;


                        const task =
                            dayPlan.tasks.find(
                                function (task) {

                                    return (
                                        task.name ===
                                        taskName
                                    );

                                }
                            );


                        if (task) {

                            task.completed =
                                true;

                            task.completedAt =
                                new Date()
                                    .toISOString();

                        }


                        button.innerText =
                            "✓ COMPLETED";


                        button.disabled =
                            true;


                        button.style.opacity =
                            "0.5";


                        updateProgress();

                        refreshRightNow();

                    }
                );

            }
        );


    // Focus buttons

    document
        .querySelectorAll(
            ".focus-button"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        startFocusMode(
                            button.dataset.focusTask
                        );

                    }
                );

            }
        );


    // Buttons

    document
        .getElementById(
            "worthItMomentButton"
        )
        .addEventListener(
            "click",
            showWorthItMoment
        );


    document
        .getElementById(
            "lateButton"
        )
        .addEventListener(
            "click",
            showLateScreen
        );


    document
        .getElementById(
            "replanButton"
        )
        .addEventListener(
            "click",
            showReplanScreen
        );


    document
        .getElementById(
            "rightNowButton"
        )
        .addEventListener(
            "click",
            showRightNowScreen
        );


    document
        .getElementById(
            "restartButton"
        )
        .addEventListener(
            "click",
            function () {

                clearInterval(
                    focusTimer
                );

                location.reload();

            }
        );


    updateProgress();

}


// ============================================================
// RIGHT NOW
// ============================================================

function generateRightNow(
    schedule
) {

    const remaining =
        dayPlan.tasks.filter(
            function (task) {

                return !task.completed;

            }
        );


    if (
        remaining.length === 0
    ) {

        return `

            <div
                class="right-now-label"
            >
                RIGHT NOW
            </div>

            <div
                class="right-now-task"
            >
                YOU'RE DONE.
            </div>

            <div
                class="right-now-message"
            >
                Everything important is complete.
            </div>

        `;

    }


    let bestTask =
        null;


    let bestScore =
        -Infinity;


    remaining.forEach(
        function (task) {

            const prepared = {

                name:
                    task.name,

                duration:
                    task.duration,

                deadline:
                    task.deadline,

                priority:
                    calculatePriority(
                        task
                    ),

                type:
                    understandTask(
                        task.name
                    )

            };


            prepared.energyScore =
                getEnergyScore(
                    prepared
                );


            prepared.valueScore =
                calculateValueScore(
                    prepared
                );


            let score =
                prepared.valueScore;


            // Prefer shorter tasks when
            // energy is low

            if (
                dayPlan.energy === "low" &&
                task.duration <= 30
            ) {

                score += 15;

            }


            if (
                score > bestScore
            ) {

                bestScore =
                    score;

                bestTask =
                    task;

            }

        }
    );


    if (!bestTask) {

        return "";

    }


    let reason =
        "This is the highest-value next step.";


    if (
        bestTask.deadline
    ) {

        reason =
            `It has a deadline at ${formatDeadline(
                bestTask.deadline
            )}.`;

    }

    else if (
        understandTask(
            bestTask.name
        ) === "mental"
    ) {

        reason =
            "It needs focused attention, so doing it deliberately now is better than leaving it hanging.";

    }

    else if (
        dayPlan.energy === "low"
    ) {

        reason =
            "It is achievable with your current energy and keeps momentum without overwhelming you.";

    }


    return `

        <div
            class="right-now-label"
        >
            RIGHT NOW
        </div>


        <div
            class="right-now-task"
        >
            ${escapeHTML(
                bestTask.name
            )}
        </div>


        <div
            class="right-now-duration"
        >
            ${formatDuration(
                bestTask.duration
            )}
        </div>


        <div
            class="right-now-message"
        >
            ${escapeHTML(
                reason
            )}
        </div>


        <button
            id="rightNowFocusButton"
            data-focus-task="${escapeHTML(
                bestTask.name
            )}"
        >
            🎯 START THIS
        </button>

    `;

}


// ============================================================
// RIGHT NOW SCREEN
// ============================================================

function showRightNowScreen() {

    const schedule =
        dayPlan.currentSchedule;


    if (!schedule) {

        generateDay();

        return;

    }


    document.querySelector(
        ".intro"
    ).innerHTML = `

        <div class="eyebrow">
            DON'T THINK. JUST START.
        </div>

        <h1>
            RIGHT NOW.
        </h1>

        <p>
            You don't need to figure out
            your whole day again.
        </p>


        <div
            class="right-now-card"
        >

            ${generateRightNow(
                schedule
            )}

        </div>


        <button
            id="backToDayButton"
        >
            ← BACK TO MY DAY
        </button>

    `;


    const focusButton =
        document.getElementById(
            "rightNowFocusButton"
        );


    if (focusButton) {

        focusButton.addEventListener(
            "click",
            function () {

                startFocusMode(
                    focusButton.dataset.focusTask
                );

            }
        );

    }


    document
        .getElementById(
            "backToDayButton"
        )
        .addEventListener(
            "click",
            function () {

                showDayResult(
                    dayPlan.currentSchedule
                );

            }
        );

}


// ============================================================
// REFRESH RIGHT NOW
// ============================================================

function refreshRightNow() {

    const card =
        document.getElementById(
            "rightNowCard"
        );


    if (!card) {
        return;
    }


    card.innerHTML =
        generateRightNow(
            dayPlan.currentSchedule
        );


    const button =
        document.getElementById(
            "rightNowFocusButton"
        );


    if (button) {

        button.addEventListener(
            "click",
            function () {

                startFocusMode(
                    button.dataset.focusTask
                );

            }
        );

    }

}


// ============================================================
// WHY THIS PLAN
// ============================================================

function generatePlanExplanation() {

    const explanations =
        [];


    if (
        dayPlan.energy ===
        "high"
    ) {

        explanations.push(
            "Your highest-energy tasks are placed earlier so your focus is used where it matters most."
        );

    }

    else if (
        dayPlan.energy ===
        "good"
    ) {

        explanations.push(
            "Important work is protected while your energy is still useful."
        );

    }

    else if (
        dayPlan.energy ===
        "calm"
    ) {

        explanations.push(
            "The plan avoids stacking too many demanding tasks together."
        );

    }

    else if (
        dayPlan.energy ===
        "low"
    ) {

        explanations.push(
            "The plan favors achievable progress instead of overwhelming you."
        );

    }


    const deadlineTasks =
        dayPlan.tasks.filter(
            function (task) {

                return (
                    task.deadline &&
                    !task.completed
                );

            }
        );


    if (
        deadlineTasks.length >
        0
    ) {

        explanations.push(
            "Tasks with deadlines are protected first so important commitments don't get pushed too late."
        );

    }


    if (
        dayPlan.events.length >
        0
    ) {

        explanations.push(
            "Fixed commitments are treated as anchors and flexible work is arranged around them."
        );

    }


    if (
        dayPlan.availableMinutes !==
        null
    ) {

        explanations.push(
            `You only gave WORTH IT ${formatDuration(
                dayPlan.availableMinutes
            )}, so lower-value tasks can wait instead of overcrowding your day.`
        );

    }


    const mentalTasks =
        dayPlan.tasks.filter(
            function (task) {

                return (
                    understandTask(
                        task.name
                    ) === "mental" &&
                    !task.completed
                );

            }
        );


    if (
        mentalTasks.length >
        0
    ) {

        explanations.push(
            "Deep-focus work is separated from lighter activities to reduce unnecessary switching."
        );

    }


    if (
        explanations.length ===
        0
    ) {

        explanations.push(
            "Your tasks are arranged to create a realistic flow instead of simply making a longer list."
        );

    }


    return explanations
        .slice(0, 3)
        .map(
            function (text) {

                return `

                    <div
                        class="why-point"
                    >

                        <span>
                            ✦
                        </span>

                        <span>
                            ${escapeHTML(
                                text
                            )}
                        </span>

                    </div>

                `;

            }
        )
        .join("");

}


// ============================================================
// PROGRESS
// ============================================================

function updateProgress() {

    const totalTasks =
        dayPlan.tasks.length;


    const completedTasks =
        dayPlan.tasks.filter(
            function (task) {

                return task.completed;

            }
        ).length;


    let percentage =
        0;


    if (
        totalTasks > 0
    ) {

        percentage =
            Math.round(
                (
                    completedTasks /
                    totalTasks
                ) * 100
            );

    }


    const percentElement =
        document.getElementById(
            "progressPercent"
        );


    const fillElement =
        document.getElementById(
            "progressFill"
        );


    const infoElement =
        document.getElementById(
            "progressInfo"
        );


    if (
        percentElement
    ) {

        percentElement.innerText =
            percentage + "%";

    }


    if (
        fillElement
    ) {

        fillElement.style.width =
            percentage + "%";

    }


    if (
        infoElement
    ) {

        infoElement.innerText =
            `${completedTasks} of ${totalTasks} tasks completed`;

    }


    if (
        completedTasks ===
        totalTasks &&
        totalTasks > 0
    ) {

        dayPlan.completedAt =
            new Date()
                .toISOString();

    }

}


// ============================================================
// FOCUS MODE
// ============================================================

function startFocusMode(
    taskName
) {

    const task =
        dayPlan.tasks.find(
            function (task) {

                return (
                    task.name ===
                    taskName
                );

            }
        );


    if (!task) {
        return;
    }


    clearInterval(
        focusTimer
    );


    focusTaskName =
        task.name;


    focusSeconds =
        task.duration * 60;


    focusPaused =
        false;


    document.querySelector(
        ".intro"
    ).innerHTML = `

        <div
            class="focus-screen"
        >

            <div
                class="focus-label"
            >
                FOCUS MODE
            </div>


            <div
                class="focus-task"
            >
                ${escapeHTML(
                    task.name
                )}
            </div>


            <div
                class="focus-timer"
                id="focusTimer"
            >
                ${formatFocusTime(
                    focusSeconds
                )}
            </div>


            <div
                class="focus-message"
                id="focusMessage"
            >
                One task. Nothing else.
            </div>


            <div
                class="focus-controls"
            >

                <button
                    id="pauseFocusButton"
                >
                    PAUSE
                </button>


                <button
                    id="finishFocusButton"
                >
                    ✓ FINISH
                </button>

            </div>


            <button
                id="backFocusButton"
                class="focus-back"
            >
                ← BACK TO MY DAY
            </button>

        </div>

    `;


    document
        .getElementById(
            "pauseFocusButton"
        )
        .addEventListener(
            "click",
            toggleFocusTimer
        );


    document
        .getElementById(
            "finishFocusButton"
        )
        .addEventListener(
            "click",
            finishFocusTask
        );


    document
        .getElementById(
            "backFocusButton"
        )
        .addEventListener(
            "click",
            function () {

                clearInterval(
                    focusTimer
                );


                showDayResult(
                    dayPlan.currentSchedule
                );

            }
        );


    focusTimer =
        setInterval(
            runFocusTimer,
            1000
        );

}


// ============================================================
// FOCUS TIMER
// ============================================================

function runFocusTimer() {

    if (
        focusPaused
    ) {
        return;
    }


    focusSeconds--;


    const timer =
        document.getElementById(
            "focusTimer"
        );


    if (
        timer
    ) {

        timer.innerText =
            formatFocusTime(
                focusSeconds
            );

    }


    if (
        focusSeconds <= 0
    ) {

        clearInterval(
            focusTimer
        );


        finishFocusTask();

    }

}


// ============================================================
// PAUSE
// ============================================================

function toggleFocusTimer() {

    focusPaused =
        !focusPaused;


    const button =
        document.getElementById(
            "pauseFocusButton"
        );


    const message =
        document.getElementById(
            "focusMessage"
        );


    if (
        focusPaused
    ) {

        button.innerText =
            "RESUME";


        message.innerText =
            "Paused. Come back when you're ready.";

    }

    else {

        button.innerText =
            "PAUSE";


        message.innerText =
            "One task. Nothing else.";

    }

}


// ============================================================
// FINISH FOCUS TASK
// ============================================================

function finishFocusTask() {

    clearInterval(
        focusTimer
    );


    const task =
        dayPlan.tasks.find(
            function (task) {

                return (
                    task.name ===
                    focusTaskName
                );

            }
        );


    if (task) {

        task.completed =
            true;


        task.completedAt =
            new Date()
                .toISOString();

    }


    updateProgress();


    if (
        dayPlan.tasks.every(
            function (task) {

                return task.completed;

            }
        )
    ) {

        showWorthItMoment();

        return;

    }


    generateDay();

}


// ============================================================
// WORTH IT MOMENT
// ============================================================

function showWorthItMoment() {

    const completed =
        dayPlan.tasks.filter(
            function (task) {

                return task.completed;

            }
        ).length;


    const total =
        dayPlan.tasks.length;


    document.querySelector(
        ".intro"
    ).innerHTML = `

        <div
            class="eyebrow"
        >
            TAKE A MOMENT
        </div>


        <h1>
            WHAT MADE<br>
            TODAY WORTH IT?
        </h1>


        <p>
            It doesn't have to be everything.
            Just one thing that mattered.
        </p>


        <div
            class="answer-box"
        >

            <textarea
                id="worthItInput"
                class="worth-it-input"
                rows="4"
                placeholder="Example: I finally understood recursion."
            ></textarea>


            <button
                id="saveWorthItButton"
            >
                SAVE THE MOMENT →
            </button>

        </div>


        <div
            class="moment-progress"
        >
            ${completed} of ${total}
            tasks completed
        </div>


        <button
            id="skipMomentButton"
            class="secondary-button"
        >
            JUST SHOW ME TODAY
        </button>

    `;


    document
        .getElementById(
            "saveWorthItButton"
        )
        .addEventListener(
            "click",
            saveWorthItMoment
        );


    document
        .getElementById(
            "skipMomentButton"
        )
        .addEventListener(
            "click",
            showDayReflection
        );

}


// ============================================================
// SAVE WORTH IT MOMENT
// ============================================================

function saveWorthItMoment() {

    const input =
        document.getElementById(
            "worthItInput"
        );


    const moment =
        input.value.trim();


    if (!moment) {

        alert(
            "Write one small thing that made today meaningful."
        );

        return;

    }


    try {

        localStorage.setItem(
            "worthItMoment",
            moment
        );

    }

    catch (error) {

        console.warn(
            "Could not save moment.",
            error
        );

    }


    showDayReflection(
        moment
    );

}


// ============================================================
// DAY REFLECTION
// ============================================================

function showDayReflection(
    moment = null
) {

    let savedMoment =
        moment;


    if (!savedMoment) {

        try {

            savedMoment =
                localStorage.getItem(
                    "worthItMoment"
                );

        }

        catch (error) {

            savedMoment =
                null;

        }

    }


    const completed =
        dayPlan.tasks.filter(
            function (task) {

                return task.completed;

            }
        ).length;


    const total =
        dayPlan.tasks.length;


    let reflection =
        "You moved the day forward.";


    if (
        completed === total &&
        total > 0
    ) {

        reflection =
            "You finished what mattered. That's a day well spent.";

    }

    else if (
        completed >=
        Math.ceil(total / 2)
    ) {

        reflection =
            "You made meaningful progress without needing to do everything.";

    }

    else {

        reflection =
            "A day doesn't need to be perfect to be worthwhile.";

    }


    document.querySelector(
        ".intro"
    ).innerHTML = `

        <div
            class="eyebrow"
        >
            TODAY
        </div>


        <h1>
            THAT'S<br>
            WORTH IT.
        </h1>


        <p>
            ${escapeHTML(
                reflection
            )}
        </p>


        <div
            class="reflection-card"
        >

            <div
                class="reflection-label"
            >
                TODAY'S PROGRESS
            </div>


            <div
                class="reflection-number"
            >
                ${completed}
                /
                ${total}
            </div>


            <div
                class="reflection-small"
            >
                tasks completed
            </div>


            ${
                savedMoment
                ?
                `
                    <div
                        class="reflection-label"
                    >
                        YOUR WORTH IT MOMENT
                    </div>

                    <div
                        class="reflection-moment"
                    >
                        “${escapeHTML(
                            savedMoment
                        )}”
                    </div>
                `
                :
                ""
            }

        </div>


        <button
            id="backFromReflectionButton"
        >
            ← BACK TO MY DAY
        </button>


        <button
            id="newMomentButton"
            class="secondary-button"
        >
            ADD ANOTHER MOMENT
        </button>

    `;


    document
        .getElementById(
            "backFromReflectionButton"
        )
        .addEventListener(
            "click",
            function () {

                showDayResult(
                    dayPlan.currentSchedule
                );

            }
        );


    document
        .getElementById(
            "newMomentButton"
        )
        .addEventListener(
            "click",
            showWorthItMoment
        );

}


// ============================================================
// SMART REPLAN
// ============================================================

function showReplanScreen() {

    document.querySelector(
        ".intro"
    ).innerHTML = `

        <div
            class="eyebrow"
        >
            PLANS CHANGE.
        </div>


        <h1>
            WHAT CHANGED?
        </h1>


        <p>
            WORTH IT will rebuild
            the rest of your day.
        </p>


        <div
            class="answer-box"
        >

            <label
                class="custom-time-label"
            >
                CURRENT TIME
            </label>


            <input
                type="time"
                id="currentTime"
            >


            <button
                id="replanNowButton"
            >
                REPLAN MY DAY →
            </button>

        </div>


        <button
            id="smartReplanButton"
            class="secondary-button"
        >
            USE MY CURRENT PLAN
        </button>

    `;


    document
        .getElementById(
            "replanNowButton"
        )
        .addEventListener(
            "click",
            replanDay
        );


    document
        .getElementById(
            "smartReplanButton"
        )
        .addEventListener(
            "click",
            function () {

                const current =
                    getCurrentMinutes();


                replanFromTime(
                    current
                );

            }
        );

}


// ============================================================
// REPLAN DAY
// ============================================================

function replanDay() {

    const input =
        document.getElementById(
            "currentTime"
        );


    if (
        !input ||
        !input.value
    ) {

        alert(
            "Please tell me what time it is."
        );

        return;

    }


    replanFromTime(
        timeToMinutes(
            input.value
        )
    );

}


// ============================================================
// REPLAN FROM TIME
// ============================================================

function replanFromTime(
    now
) {

    const remaining =
        getPreparedRemainingTasks();


    const remainingMinutes =
        dayPlan.availableMinutes !==
        null
            ?
            Math.max(
                0,
                dayPlan.availableMinutes
            )
            :
            null;


    const schedule =
        buildSmartSchedule(
            remaining,
            now,
            remainingMinutes
        );


    dayPlan.currentSchedule =
        schedule;


    showDayResult(
        schedule
    );

}


// ============================================================
// RUNNING LATE
// ============================================================

function showLateScreen() {

    document.querySelector(
        ".intro"
    ).innerHTML = `

        <div
            class="eyebrow"
        >
            PLANS CHANGE.
        </div>


        <h1>
            RUNNING LATE?
        </h1>


        <p>
            How much time did your day lose?
        </p>


        <div
            class="answer-box"
        >

            <input
                type="number"
                id="lateMinutes"
                placeholder="Example: 30"
                min="1"
            >


            <button
                id="applyLateButton"
            >
                ADJUST MY DAY →
            </button>

        </div>

    `;


    document
        .getElementById(
            "applyLateButton"
        )
        .addEventListener(
            "click",
            applyLateTime
        );

}


// ============================================================
// APPLY LATE
// ============================================================

function applyLateTime() {

    const input =
        document.getElementById(
            "lateMinutes"
        );


    const lateMinutes =
        Number(
            input.value
        );


    if (
        !lateMinutes ||
        lateMinutes <= 0
    ) {

        alert(
            "Please enter how many minutes late you are."
        );

        return;

    }


    const startTime =
        dayPlan.planStart +
        lateMinutes;


    replanFromTime(
        startTime
    );

}


// ============================================================
// GET REMAINING TASKS
// ============================================================

function getPreparedRemainingTasks() {

    return dayPlan.tasks
        .filter(
            function (task) {

                return !task.completed;

            }
        )
        .map(
            function (task) {

                const type =
                    understandTask(
                        task.name
                    );


                const prepared = {

                    name:
                        task.name,

                    duration:
                        task.duration,

                    deadline:
                        task.deadline,

                    priority:
                        calculatePriority(
                            task
                        ),

                    type:
                        type,

                    energyScore:
                        getEnergyScore({

                            name:
                                task.name,

                            type:
                                type

                        })

                };


                prepared.valueScore =
                    calculateValueScore(
                        prepared
                    );


                return prepared;

            }
        )
        .sort(
            compareTasks
        );

}


// ============================================================
// CURRENT TIME
// ============================================================

function getCurrentMinutes() {

    const now =
        new Date();


    return (
        now.getHours() * 60
        +
        now.getMinutes()
    );

}


// ============================================================
// TIME → MINUTES
// ============================================================

function timeToMinutes(
    time
) {

    if (!time) {
        return 0;
    }


    const parts =
        time.split(":");


    return (
        Number(parts[0]) * 60
        +
        Number(parts[1])
    );

}


// ============================================================
// MINUTES → DISPLAY TIME
// ============================================================

function formatMinutes(
    totalMinutes
) {

    totalMinutes =
        Math.max(
            0,
            totalMinutes
        );


    let hour =
        Math.floor(
            totalMinutes / 60
        );


    const minute =
        totalMinutes % 60;


    let suffix =
        "AM";


    if (
        hour >= 12
    ) {

        suffix =
            "PM";

    }


    if (
        hour > 12
    ) {

        hour -= 12;

    }


    if (
        hour === 0
    ) {

        hour =
            12;

    }


    const formattedMinute =
        minute < 10
            ?
            "0" + minute
            :
            minute;


    return (
        `${hour}:${formattedMinute} ${suffix}`
    );

}


// ============================================================
// DEADLINE
// ============================================================

function formatDeadline(
    time
) {

    if (!time) {
        return "";
    }


    return formatMinutes(
        timeToMinutes(
            time
        )
    );

}


// ============================================================
// DURATION
// ============================================================

function formatDuration(
    minutes
) {

    if (
        minutes < 60
    ) {

        return (
            `${minutes} min`
        );

    }


    const hours =
        Math.floor(
            minutes / 60
        );


    const remaining =
        minutes % 60;


    if (
        remaining === 0
    ) {

        return (
            hours === 1
                ?
                "1 hour"
                :
                `${hours} hours`
        );

    }


    return (
        `${hours}h ${remaining}m`
    );

}


// ============================================================
// FOCUS TIME
// ============================================================

function formatFocusTime(
    seconds
) {

    seconds =
        Math.max(
            0,
            seconds
        );


    const minutes =
        Math.floor(
            seconds / 60
        );


    const remainingSeconds =
        seconds % 60;


    const formattedMinutes =
        minutes < 10
            ?
            "0" + minutes
            :
            minutes;


    const formattedSeconds =
        remainingSeconds < 10
            ?
            "0" + remainingSeconds
            :
            remainingSeconds;


    return (
        `${formattedMinutes}:${formattedSeconds}`
    );

}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHTML(
    text
) {

    return String(
        text
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}