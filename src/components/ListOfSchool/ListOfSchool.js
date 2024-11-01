"use client";

import React, { useState, useEffect } from "react";
import styles from "@/components/ListOfSchool/ListOfSchool.module.css";
import { Container, Row, Col, Button } from "react-bootstrap";
import axios from "axios";
import { z } from "zod";
import Link from "next/link";
import logodashboard from "../../../public/logodashboard.svg";
import { useRouter } from "next/navigation";
import Image from "next/image";

const studentSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  studentSurname: z.string().min(1, "Surname is required"),
  gardianName: z.string().min(1, "Guardian Name is required"),
  selectedAward: z.string().nonempty("Award is required"),
  selectedClass: z.string().nonempty("Class is required"),
});

const Cards = () => {
  const router = useRouter();
  const [value, setValue] = useState(1);
  const [schools, setSchools] = useState([]);
  const [awards, setAwards] = useState([]);
  const [schoolId, setSchoolId] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [students, setStudents] = useState([
    {
      id: `${Date.now()}-${Math.random()}`,
      firstName: "",
      studentSurname: "",
      gardianName: "",
      selectedAward: "",
      selectedClass: "",
      setAmount: 100,
    },
  ]);
  const [errors, setErrors] = useState({});
  const [duplicateError, setDuplicateError] = useState("");

  // Fetch schools
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await axios.get(
          "https://edsidera-release-231650504fa8.herokuapp.com/api/school/get"
        );
        setSchools(response.data.data.schools || []);
      } catch (error) {
        console.error("Error fetching schools:", error);
      }
    };

    fetchSchools();
  }, []);

  // Fetch awards
  useEffect(() => {
    const fetchAwards = async () => {
      if (!schoolId) return;

      try {
        const response = await axios.get(
          `https://edsidera-release-231650504fa8.herokuapp.com/api/award/all/${schoolId}`
        );
        setAwards(response.data.data.Awards || []);
      } catch (error) {
        console.error("Error fetching awards:", error);
      }
    };

    fetchAwards();
  }, [schoolId]);

  const handleSchoolChange = async (e) => {
    const schoolId = e.target.value;
    setSchoolId(schoolId);
  };

  const handleStudentChange = (index, field, value) => {
    const updatedStudents = [...students];
    updatedStudents[index][field] = value;
    setStudents(updatedStudents);
  };

  let calculate = value * 100;

  const handleAddStudent = () => {
    setStudents([
      ...students,
      {
        id: `${Date.now()}-${Math.random()}`,
        firstName: "",
        studentSurname: "",
        gardianName: "",
        selectedAward: "",
        selectedClass: "",
        setAmount: 100,
      },
    ]);
    setValue(value + 1);
  };

  const handleRemoveStudent = (index) => {
    const updatedStudents = students.filter((_, i) => i !== index);
    setStudents(updatedStudents);
    setValue(value - 1);
  };

  const hasDuplicates = () => {
    const uniqueEntries = new Set();
    for (const student of students) {
      const studentKey = `${student.firstName}-${student.studentSurname}-${student.gardianName}-${student.selectedAward}`;
      if (uniqueEntries.has(studentKey)) {
        return true;
      }
      uniqueEntries.add(studentKey);
    }
    return false;
  };

  const handleMakePayment = () => {
    // Check for duplicates
    if (hasDuplicates()) {
      setDuplicateError(
        "Duplicate entries found. Please ensure each row is unique."
      );
      return;
    } else {
      setDuplicateError("");
    }

    const validationResults = students
      .map((student, index) => {
        try {
          studentSchema.parse(student);
          return null;
        } catch (error) {
          return { index, errors: error.errors };
        }
      })
      .filter(Boolean);

    if (validationResults.length) {
      const validationErrors = {};
      validationResults.forEach((result) => {
        validationErrors[result.index] = result.errors;
      });
      setErrors(validationErrors);
      return;
    }

    const payload = {
      school_id: schoolId,
      transactions: students.map((student, index) => ({
        award_id: student.selectedAward,
        class_id: student.selectedClass,
        first_name: student.firstName,
        last_name: student.studentSurname,
        guardian: student.gardianName,
        transaction_id: index + 1,
        status: "processing",
        amount: 100,
        currency: "USD",
        is_smm: isChecked,
      })),
    };
    console.log("Payload for payment:", payload);
    console.log("Total payment amount:", calculate);
    router.push("/");
    setErrors("");
  };

  return (
    <Container>
      <Row className={`gx-2 gy-4 ${styles.cards_group}`}>
        <Col lg={12}>
          <div className={styles.log0s}>
            <Image src={logodashboard} className="img-fluid" alt="log" />
            <Link className={styles.logout} href="/">
              Logout
            </Link>
          </div>
        </Col>
        <Col lg={3}>
          <h3>Select Schools</h3>
          <select
            className="form-select"
            value={schoolId}
            onChange={handleSchoolChange}
          >
            <option value="">Select Schools</option>
            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.school_title}
              </option>
            ))}
          </select>
        </Col>

        {duplicateError && (
          <Col lg={12}>
            <p className="text-danger">{duplicateError}</p>
          </Col>
        )}

        {students.map((student, index) => (
          <React.Fragment key={index}>
            <Col lg={12}>
              <h3>Select Awards</h3>
            </Col>
            <Col lg={3} className="mt-0">
              <select
                className="form-select"
                value={student.selectedAward}
                onChange={(e) =>
                  handleStudentChange(index, "selectedAward", e.target.value)
                }
              >
                <option value="">Select Awards</option>
                {awards.map((award) => (
                  <option key={award.id} value={award.id}>
                    {award.award_title}
                  </option>
                ))}
              </select>
              {errors[index]?.find((err) => err.path[0] === "selectedAward")
                ?.message && (
                <p className="text-danger fontsize">
                  {
                    errors[index].find((err) => err.path[0] === "selectedAward")
                      .message
                  }
                </p>
              )}
            </Col>
            <Col lg={3} className="mt-0">
              <select
                className="form-select"
                value={student.selectedClass}
                onChange={(e) =>
                  handleStudentChange(index, "selectedClass", e.target.value)
                }
              >
                <option value="">Open this select menu</option>
                {awards
                  .filter(
                    (award) => award.id === parseInt(student.selectedAward)
                  )
                  .flatMap((award) =>
                    award.Classes.map((classItem) => (
                      <option key={classItem.id} value={classItem.id}>
                        {classItem.class_title}
                      </option>
                    ))
                  )}
              </select>
              {errors[index]?.find((err) => err.path[0] === "selectedClass")
                ?.message && (
                <p className="text-danger fontsize">
                  {
                    errors[index].find((err) => err.path[0] === "selectedClass")
                      .message
                  }
                </p>
              )}
            </Col>
            <Col lg={2} className="inputBox mt-0">
              <input
                type="text"
                placeholder="First Name"
                className="form-control"
                value={student.firstName}
                onChange={(e) =>
                  handleStudentChange(index, "firstName", e.target.value)
                }
              />
              {errors[index]?.find((err) => err.path[0] === "firstName")
                ?.message && (
                <p className="text-danger fontsize">
                  {
                    errors[index].find((err) => err.path[0] === "firstName")
                      .message
                  }
                </p>
              )}
            </Col>
            <Col lg={2} className="inputBox mt-0">
              <input
                type="text"
                placeholder="Surname"
                className="form-control"
                value={student.studentSurname}
                onChange={(e) =>
                  handleStudentChange(index, "studentSurname", e.target.value)
                }
              />
              {errors[index]?.find((err) => err.path[0] === "studentSurname")
                ?.message && (
                <p className="text-danger fontsize">
                  {
                    errors[index].find(
                      (err) => err.path[0] === "studentSurname"
                    ).message
                  }
                </p>
              )}
            </Col>
            <Col lg={2} className="inputBox mt-0">
              <input
                type="text"
                placeholder="Guardian Name"
                className="form-control"
                value={student.gardianName}
                onChange={(e) =>
                  handleStudentChange(index, "gardianName", e.target.value)
                }
              />
              {errors[index]?.find((err) => err.path[0] === "gardianName")
                ?.message && (
                <p className="text-danger fontsize">
                  {
                    errors[index].find((err) => err.path[0] === "gardianName")
                      .message
                  }
                </p>
              )}
            </Col>
            <Col lg={12} className="addInputBtn d-flex mt-0 mb-3">
              <Button variant="link" onClick={handleAddStudent}>
                Add More Student
              </Button>
              {students.length > 1 && (
                <Button
                  variant="link"
                  onClick={() => handleRemoveStudent(index)}
                >
                  Remove Student
                </Button>
              )}
            </Col>
          </React.Fragment>
        ))}

        <Col lg={12} className={`${styles.remoark} mt-5 d-flex`}>
          <Button onClick={handleMakePayment}>Make Payment</Button>
          <p>
            Total Cost:
            <span className={styles.valuepayment}>${calculate}</span>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Cards;
