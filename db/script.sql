-- Active: 1698352821439@@127.0.0.1@3306@crud02
CREATE DATABASE IF NOT EXISTS formBase;

USE formBase;

CREATE TABLE
          IF NOT EXISTS usuarios (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    carrera VARCHAR(80) NOT NULL,
                    nombres VARCHAR(70) NOT NULL,
                    apellidos VARCHAR(80) NOT NULL,
                    dni VARCHAR(8) NOT NULL,
                    fecha_nacimiento DATE NOT NULL,
                    correo_institucional VARCHAR(100) NOT NULL,
                    contrasena VARCHAR(100) NOT NULL
          );

ALTER TABLE usuarios
ADD COLUMN fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

select
          *
from
          usuarios;