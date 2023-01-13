# pull official base image
FROM python:3.9.0-slim-buster

# set working directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install dependencies
RUN apt-get update
RUN apt-get -y install gcc
RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install -r requirements.txt
# RUN pip install web3

# add app
COPY . .

# start app
# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

