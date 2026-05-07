# Fersi26.github.io
- install ollama and the model gemma3:1b (or download any model that can run on your machine smoothly)
- in the command prompt create a model file in which you add your info "https://www.youtube.com/watch?v=VBtSCLU5tsU" and save it as gemma-custom3:1b
- specify the logs directory in (LOG_DIR = r"..\logs") line 29 in portfolio/"Web Apps"/7 portfolio_3D/ollama.py
- change your picture in portfolio/"Web Apps"/7 portfolio_3D/images/mendesk.png (white background or invisible recommended)
- add your links in <div class="social-container"> line 34 in portfolio/"Web Apps"/7 portfolio_3D/index.html
- add your contact infos in line 70 <div class="contact-container">

Version of python compatibility 
- Minimum is python 3.8 for FastAPI and Pydantic
Maximum supported is python 3.12 which is current stable release; all these libraries should be compatible, i personally use 3.11.4
- install the python dependencies by : pip install fastapi uvicorn flask flask-cors pydantic
- run directory_indexer located in portfolio/"Web Apps"/ by (python directory_indexer.py)
- run both python files in terminal : (python app.py) and (python ollama.py)
- forward a port in vs code 8000 or 5343 and make it publicly visible then open the link in browser

