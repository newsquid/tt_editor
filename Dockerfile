FROM dockerfile/nodejs

ADD . /data

CMD ["make","serve"]
