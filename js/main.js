const Main = {

	tasks: [],

	init: function () {
		this.cacheSelectors()
		this.bindEvents()
		this.getStoraged()
		this.buildTasks()
	},

	cacheSelectors: function () {
		this.$checkButtons = document.querySelectorAll('.check')
		this.$inputTask = document.querySelector('#inputTask')
		this.$list = document.querySelector('#list')
		this.$removeButtons = document.querySelectorAll('.remove')
	},

	bindEvents: function () {
		const self = this 
		this.$checkButtons.forEach(function(button) {
			button.onclick = self.Events.checkButton_click
		})


		this.$inputTask.onkeypress = self.Events.$inputTask_keypress.bind(this)

		this.$removeButtons.forEach(function(button){
			button.onclick = self.Events.$removeButtons_click.bind(self)
		})
	},

	getStoraged: function(){
		const tasks = localStorage.getItem('tasks')
		this.tasks = JSON.parse(tasks)
	},

	getTaskHtml: function(task){
		return `
			<li>
				<div class="check"></div>
				<label class="task">
					${task}
				</label>
				<button class="remove" data-task="${task}"></button>
			</li>
		`
	},


	buildTasks: function(){
		let html =''

		this.tasks.forEach(item =>{
			html += this.getTaskHtml(item.task)
		})

		this.$list.innerHTML = html

		this.cacheSelectors()
		this.bindEvents()
	},


	Events:{
		checkButton_click: function(e){
			const li = e.target.parentElement
			const isDone = li.classList.contains('done')
			const value = e.target.dataset['task']
			const newTaskState = this.tasks.filter(item => item.task === value)

			if(!isDone){
				li.classList.add('done')
				localStorage.setItem('tasks', JSON.stringify(newTaskState))
				return
			}
			li.classList.remove('done')

		},

		$inputTask_keypress: function(e){
			
			const key = e.key
			const value = e.target.value

			if(key === 'Enter'){
				this.$list.innerHTML += this.getTaskHtml(value)
				e.target.value = ''
				this.cacheSelectors()
				this.bindEvents()

				const savedTasks = localStorage.getItem('tasks')
				const savedTasksObj = JSON.parse(savedTasks)

				const obj = [
					{task: value, done: false},
					...savedTasksObj, 
				]
				localStorage.setItem('tasks', JSON.stringify(obj))
			}
		},

		$removeButtons_click: function(e){
			const li = e.target.parentElement
			const value = e.target.dataset['task']

			const newTaskState = this.tasks.filter(item => item.task !== value)
			localStorage.setItem('tasks', JSON.stringify(newTaskState))


			li.classList.add('removed')

			setTimeout(function(){
				li.classList.add('hidden')
			}, 300)
		}
	}
}

Main.init()