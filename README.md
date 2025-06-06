To run this application on your system, follow the instructions.

## Setup Backend.
1. Move to backend directory.

2. Create a new virtual environment

```bash
python -m venv myvenv                                             
```
3. Activate the virtual environment.

```bash
source myvenv/bin/activate                                            
```
4. Install requirements

```bash
pip install -r requirements.txt
```
5. Run the flask application.

```bash
python app.py
```
Your flask backend is now running! 

(Make sure to correctly enter your keys in a config.py file.)

## Setup Frontend.

1. Navigate to frontend directory.
2. Install dependencies.
```bash
npm install
```
3. Start react app.
```bash
npm start
```

## Expose Backend
1. To expose your local flask app. Run:
```bash
ngrok http 5000
```
2. Go to the repository whose events you want to track and add the link from it to that repo's webhook with the route '/webhook'.
It would look something like this:
```bash
https://ngroklink.app/webhook
```
Now the application is ready to tract events on that repo.
*******************